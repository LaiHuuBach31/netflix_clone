<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mapper\UserMapper;
use App\Models\User;
use App\Services\UserRoleService;
use App\Services\UserService;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
            DB::commit();
            return $this->successResponse([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' => auth()->user(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
        }
    }

    public function login(Request $request)
    {
        $data = $request->only('email', 'password');

        $token = Auth::attempt($data);

        if (!$token) {
            return $this->unauthorizedResponse([], 'Invalid credentials');
        }

        return $this->successResponse([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => auth()->user(),
        ]);
    }


    public function logout()
    {
        Auth::logout();
        return $this->okResponse([], 'Successfully logged out');
    }

    public function refresh()
    {
        try {
            $newToken = Auth::refresh();
            return $this->respondWithToken($newToken, 'Token refreshed successfully');
        } catch (\Exception $e) {
            return $this->unauthorizedResponse([], 'Failed to refresh token');
        }
    }
}
