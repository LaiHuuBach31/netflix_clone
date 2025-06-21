<?php

namespace App\Http\Controllers\Api;

use App\Exports\ErrorExport;
use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

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

    public function findUserByEmail(string $email)
    {
        $user = $this->userService->findByEmail($email);
        return $this->okResponse($user, 'get user successfully');
    }

    public function store(Request $request)
    {
        $data = [
            "name" => $request->name,
            "avatar" => $request->avatar,
            "email" => $request->email,
            "status" => true,
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
                "avatar" => $request->avatar,
                "email" => $request->email,
                "status" => $request->status,
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

    public function export()
    {
        return $this->userService->exportUsers();
    }

    public function import(Request $request)
    {
        try {

            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
            ]);

            $errors = $this->userService->importUsers($request->file('file'));

            if (!empty($errors)) {
                $export = new ErrorExport($errors);
                return Excel::download($export, 'import_errors.xlsx');
            }

            return $this->okResponse(null, 'Users imported successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }
}
