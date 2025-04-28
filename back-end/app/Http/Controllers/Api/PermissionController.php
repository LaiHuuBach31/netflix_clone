<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PermissionController extends BaseController
{
    protected $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    public function index()
    {
        return $this->handleIndex($this->permissionService);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->permissionService, $id);
    }

    public function store(Request $request)
    {
        $name = strtolower(preg_replace('/\s+/', '_', trim($request->name)));
        $data = [
            'name' => $name
        ];
        try {
            $permission = $this->permissionService->createPermission($data);
            return $this->createdResponse($permission, 'Permission created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $name = strtolower(preg_replace('/\s+/', '_', trim($request->name)));
        $data = array_merge(
            ['id' => $id],
            [
                'name' => $name
            ]
        );
        try {
            $permission = $this->permissionService->updatePermission($id, $data);
            return $this->okResponse($permission, 'Permission updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->permissionService, $id, 'Permission');
    }
    
}
