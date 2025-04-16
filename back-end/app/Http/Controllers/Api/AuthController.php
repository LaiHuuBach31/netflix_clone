<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponsesTrait;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponsesTrait;

    public function login(Request $request) {
        $credentials = $request->only('email', 'request');

        $token = auth()->attempt($credentials);

        if(!$token){    
            return $this->unauthorizedResponse([], 'Invalid credentials');
        }

        return $this->successResponse([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => auth()->user(),
        ]);
    }


}
