<?php

namespace App\Http\Controllers\Api;

use App\DTOs\UserDTO;
use App\Http\Controllers\Controller;
use App\Mapper\UserMapper;
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

            $refreshToken = bin2hex(random_bytes(40));
            DB::table('refresh_tokens')->insert([
                'token' => $refreshToken,
                'user_id' => $user->id,
                'expires_at' => now()->addDays(7),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

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
            $refreshToken = bin2hex(random_bytes(40));

            if (!$token) {
                return $this->unauthorizedResponse([], 'Invalid credentials');
            }

            $refreshToken = bin2hex(random_bytes(40));
            DB::table('refresh_tokens')->insert([
                'token' => $refreshToken,
                'user_id' => $user->id,
                'expires_at' => now()->addDays(7),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

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

            $tokenRecord = DB::table('refresh_tokens')
                ->where('token', $refreshToken)
                ->where('expires_at', '>', now())
                ->first();

            if (!$tokenRecord) {
                return $this->unauthorizedResponse([], 'Invalid or expired refresh token');
            }

            $user = User::find($tokenRecord->user_id);
            if (!$user) {
                return $this->unauthorizedResponse([], 'User not found');
            }

            $newToken = Auth::login($user);

            $newRefreshToken = bin2hex(random_bytes(40));
            DB::table('refresh_tokens')->where('token', $refreshToken)->delete();
            DB::table('refresh_tokens')->insert([
                'token' => $newRefreshToken,
                'user_id' => $user->id,
                'expires_at' => now()->addDays(7),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $this->successResponse([
                'access_token' => $newToken,
                'refresh_token' => $newRefreshToken,
                'token_type' => 'Bearer',
                'expires_in' => config('jwt.ttl') * 60,
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
}
