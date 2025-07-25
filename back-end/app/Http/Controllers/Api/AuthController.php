<?php

namespace App\Http\Controllers\Api;

use App\DTOs\UserDTO;
use App\Http\Controllers\Controller;
use App\Mapper\UserMapper;
use App\Models\RefreshToken;
use App\Models\User;
use App\Services\UserRoleService;
use App\Services\UserService;
use App\Traits\ApiResponses;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    use ApiResponses;

    protected $userService;
    protected $userRoleService;

    public function __construct(UserService $userService, UserRoleService $userRoleService)
    {
        $this->userService = $userService;
        $this->userRoleService = $userRoleService;
    }

    function register(Request $request)
    {
        DB::beginTransaction();
        try {
            $userData = [
                'name' => $request->name,
                'avatar' => $request->avatar,
                'email' => $request->email,
                'password' => $request->password,
            ];

            $userDTO = $this->userService->createUser($userData, true);
            $user = User::find($userDTO->id);

            $this->userRoleService->createUserRole([
                'user_id' => $user->id,
                'role_id' => 2,
            ]);

            $token = auth()->login($user);

            if (!$token) {
                return $this->errorResponse([], 'Failed to generate token', 500);
            }

            $refreshToken = generateRefreshToken($user->id);

            $roles = $user->roles->pluck('name');

            $userDto = new UserDTO([
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'email' => $user->email,
                'roles' => $roles
            ]);

            DB::commit();
            return $this->successResponse([
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'token_type' => 'Bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' =>  $userDto,
            ], 'Login Successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->unprocessableResponse($e->errors(), 'Validation failed');
        }
    }

    public function login(Request $request)
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $data = $request->only('email', 'password');

            $user = User::where('email', $data['email'])->first();

            if (!$user) {
                return $this->unauthorizedResponse([], 'Email does not exist.');
            }

            if (!Hash::check($data['password'], $user->password)) {
                return $this->unauthorizedResponse([], 'Incorrect password.');
            }

            $token = Auth::attempt($data);

            if (!$token) {
                return $this->unauthorizedResponse([], 'Invalid credentials');
            }

            $refreshToken = generateRefreshToken($user->id);

            $user = auth()->user();
            $roles = $user->roles->pluck('name');

            $userDto = new UserDTO([
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'email' => $user->email,
                'roles' => $roles
            ]);
            DB::commit();
            return $this->successResponse([
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'token_type' => 'Bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' => $userDto,
            ]);
        } catch (ValidationException $e) {
            return $this->unprocessableResponse($e->errors(), $e->getMessage());
        } catch (Exception $e) {
            return $this->errorResponse([], 'Internal Server Error: ' . $e->getMessage());
        }
    }

    public function logout()
    {
        $user = Auth::user();
        if ($user) {
            DB::table('refresh_tokens')->where('user_id', $user->id)->delete();
        }
        Auth::logout();
        return $this->okResponse([], 'Successfully logged out');
    }

    public function refresh(Request $request)
    {
        try {
            $refreshToken = str_replace('Bearer ', '', (string) $request->header('Authorization', ''));

            if (!$refreshToken) {
                return $this->unauthorizedResponse([], 'Refresh token is missing');
            }

            $tokenRecord = RefreshToken::where('token', $refreshToken)
                ->where('expires_at', '>', now())
                ->first();

            if (!$tokenRecord) {
                return $this->unauthorizedResponse([], 'Invalid or expired refresh token');
            }

            $maxSessionDays = 30;
            $originCreatedAt = $tokenRecord->origin_created_at ?? $tokenRecord->created_at;

            if (now()->diffInDays($originCreatedAt) >= $maxSessionDays) {
                return $this->unauthorizedResponse([], 'Login session expired. Please login again.');
            }

            $user = User::find($tokenRecord->user_id);
            if (!$user) {
                return $this->unauthorizedResponse([], 'User not found');
            }

            $newToken = Auth::login($user);

            RefreshToken::where('token', $refreshToken)->delete();
            $newRefreshToken = generateRefreshToken($user->id, $originCreatedAt);

            $user = auth()->user();
            $roles = $user->roles->pluck('name');
            $userDto = new UserDTO([
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'email' => $user->email,
                'roles' => $roles
            ]);

            return $this->successResponse([
                'access_token' => $newToken,
                'refresh_token' => $newRefreshToken,
                'token_type' => 'Bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' => $userDto,
            ], 'Token refreshed successfully');
        } catch (\Exception $e) {
            return $this->unauthorizedResponse([], 'Failed to refresh token', $e->getMessage());
        }
    }

    public function getUser()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return $this->notFoundResponse([], 'User not found');
            }
            $roles = $user->roles->pluck('name');

            $userDto = new UserDTO([
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'email' => $user->email,
                'roles' => $roles
            ]);

            return $this->successResponse($userDto, 'Get user successfully');
        } catch (\Exception $e) {
            return $this->unauthorizedResponse([], 'Failed to get user');
        }
    }

    public function updateProfile(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = Auth::user();
            if (!$user) {
                return $this->unauthorizedResponse([], 'User not authenticated');
            }

            $password = $request->password ?: $user->password;

            $data = array_merge(
                ['id' => $user->id],
                [
                    "name" => $request->name,
                    "avatar" => $request->avatar,
                    "email" => $request->email,
                    "status" => true,
                    'password' => $password,
                ]
            );

            $updatedUser = $this->userService->updateUser($user->id, $data);
            $user = User::find($updatedUser->id);
            $roles = $user->roles->pluck('name');

            $userDto = new UserDTO([
                'id' => $updatedUser->id,
                'name' => $updatedUser->name,
                'avatar' => $updatedUser->avatar,
                'email' => $updatedUser->email,
                'roles' => $roles,
            ]);

            DB::commit();
            return $this->successResponse($userDto, 'Profile updated successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->unprocessableResponse($e->errors(), 'Validation failed');
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponse([], 'Internal Server Error: ' . $e->getMessage());
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return $this->unauthorizedResponse([], 'User not authenticated');
            }

            $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:6|confirmed',
            ], [
                'current_password.required' => 'The current password is required.',
                'new_password.required' => 'The new password is required.',
                'new_password.min' => 'The new password must be at least 6 characters.',
                'new_password.confirmed' => 'The new password and confirmation do not match.',
            ]);

            if (!Hash::check($request->current_password, $user->password)) {
                return $this->unauthorizedResponse([], 'Current password is incorrect.');
            }

            $data = array_merge(
                ['id' => $user->id],
                [
                    "name" => $user->name,
                    "avatar" => $user->avatar,
                    "email" => $user->email,
                    "status" => true,
                    'password' => bcrypt($request->new_password),
                ]
            );

            $updatedUser = $this->userService->updateUser($user->id, $data);
            $user = User::find($updatedUser->id);
            $roles = $user->roles->pluck('name');

            $userDto = new UserDTO([
                'id' => $updatedUser->id,
                'name' => $updatedUser->name,
                'avatar' => $updatedUser->avatar,
                'email' => $updatedUser->email,
                'roles' => $roles,
            ]);

            DB::table('refresh_tokens')->where('user_id', $user->id)->delete();
            $newToken = Auth::login($user);
            $newRefreshToken = generateRefreshToken($user->id);

            DB::commit();
            return $this->successResponse([
                'access_token' => $newToken,
                'refresh_token' => $newRefreshToken,
                'token_type' => 'Bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' => $userDto,
            ], 'Password changed successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->unprocessableResponse($e->errors(), 'Validation failed');
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponse([], 'Internal Server Error: ' . $e->getMessage());
        }
    }
}
