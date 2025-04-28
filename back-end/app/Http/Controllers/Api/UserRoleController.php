<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserRoleService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserRoleController extends BaseController
{
    protected $userRoleService;

    public function __construct(UserRoleService $userRoleService)
    {
        $this->userRoleService = $userRoleService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->userRoleService, 'name', $search, $perPage);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->userRoleService, $id);
    }

    public function store(Request $request)
    {
        $data = [
            "user_id" => $request->user_id,
            "role_id" => $request->role_id,
        ];

        try {
            $userRole = $this->userRoleService->createuserRole($data);
            return $this->createdResponse($userRole, 'User created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(
            ['id' => $id], 
            [
                "user_id" => $request->user_id,
                "role_id" => $request->role_id,
            ]
        );
        
        try {
            $user = $this->userRoleService->updateUserRole($id, $data);
            return $this->okResponse($user, 'user updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->userRoleService, $id, 'user');
    }
}
