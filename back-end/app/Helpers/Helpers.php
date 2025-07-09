<?php

use Illuminate\Support\Facades\DB;

if (!function_exists('generateRefreshToken')) {
    function generateRefreshToken($userId, $originCreatedAt = null)
    {
        $origin = $originCreatedAt ?? now();

        $refreshToken = bin2hex(random_bytes(40));
        DB::table('refresh_tokens')->insert([
            'token' => $refreshToken,
            'user_id' => $userId,
            'expires_at' => now()->addDays(7),
            'origin_created_at' => $origin,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $refreshToken;
    }
}
