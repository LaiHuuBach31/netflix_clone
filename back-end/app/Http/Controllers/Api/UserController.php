<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends BaseController
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->userService, 'name', $search, $perPage);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->userService, $id);
    }

    public function store(Request $request)
    {
        $data = [
            "name" => $request->name,
            "email" => $request->email ,
            "password" => bcrypt($request->password),
        ];

        try {
            $user = $this->userService->createUser($data);
            return $this->createdResponse($user, 'User created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(
            ['id' => $id], 
            [
                "name" => $request->name,
                "email" => $request->email ,
                "password" => bcrypt($request->password),
            ]
        );

        try {
            $user = $this->userService->updateUser($id, $data);
            return $this->okResponse($user, 'user updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->userService, $id, 'user');
    }
}
