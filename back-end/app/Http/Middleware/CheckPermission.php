<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Models\UserRole;
use App\Traits\ApiResponses;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckPermission
{
    use ApiResponses;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $permission)
    {
       
        try {
            
            $user = JWTAuth::parseToken()->authenticate();
            $roles = $user->roles;
            $permissions = [];
            foreach ($roles as $key => $role) {
                foreach ($role->permissions as $perm) {
                    $permissions[] = $perm->name;
                }
            };
          
            if (!in_array($permission, $permissions)) {
                return $this->forbiddenResponse(null, 'Unauthorized - Missing Permission: ' . $permission);
            }

            return $next($request);

        } catch (TokenInvalidException $e) {
            return $this->unauthorizedResponse(null, 'Invalid Token');
        } catch (Exception $e) {
            return $this->unauthorizedResponse(null, 'Unauthorized');
        }
    }
}
