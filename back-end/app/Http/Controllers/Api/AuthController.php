<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserRoleService;
use App\Services\UserService;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponses;

    protected $userService;
    protected $userRoleService;
    
    public function __construct(UserService $userService, UserRoleService $userRoleService) {
        $this->userService = $userService;
        $this->userRoleService = $userRoleService;
    }

    // function register(Request $request) {
    //     $userData = [
    //         'name' => $request->name,
    //         'email' => $request->email,
    //         'password' => $request->password,
    //     ];

    //     $user = $this->userService->createUser($userData, true);
    //     dd($user);
        
    //     $this->userRoleService->createUserRole([
    //         'user_id' => $user->id,
    //         'role_id' => 2,
    //     ]);

    //     $token = auth()->login($user);
    // }

    public function login(Request $request)
    {
        $data = $request->only('email', 'password');

        $token = Auth::attempt($data);

        if (!$token) {
            return $this->unauthorizedResponse([], 'Invalid credentials');
        }

        return $this->successResponse([
            'access_token' => $token,
            'token_type' => 'bearer',
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
