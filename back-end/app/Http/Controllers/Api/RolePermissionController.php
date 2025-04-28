<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RolePermissionService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RolePermissionController extends BaseController
{
    protected $rolePermissionService;

    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->rolePermissionService);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->rolePermissionService, $id);
    }

    public function store(Request $request)
    {
        $data = [
            "role_id" => $request->role_id,
            "permission_id" => $request->permission_id,
        ];

        try {
            $rolePermission = $this->rolePermissionService->createRolePermission($data);
            return $this->createdResponse($rolePermission, 'RolePermission created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(
            ['id' => $id],
            [
                "role_id" => $request->role_id,
                "permission_id" => $request->permission_id,
            ]
        );

        try {
            $user = $this->rolePermissionService->updateRolePermission($id, $data);
            return $this->okResponse($user, 'RolePermission updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->rolePermissionService, $id, 'user');
    }
}
