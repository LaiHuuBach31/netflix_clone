<?php

namespace App\Http\Controllers\Api;

use App\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RoleController extends BaseController
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->roleService, 'name', $search, $perPage);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->roleService, $id);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        try {
            $role = $this->roleService->createRole($data);
            return $this->createdResponse($role, 'Role created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = $request->all();
        try {
            $role = $this->roleService->updateRole($id, $data);
            return $this->okResponse($role, 'Role updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->roleService, $id, 'Role');
    }
    
}
