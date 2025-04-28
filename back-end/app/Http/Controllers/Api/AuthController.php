<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponses;

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
    
}
