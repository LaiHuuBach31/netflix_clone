<?php

namespace App\Imports;

use App\DTOs\UserDTO;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Validators\Failure;

class UsersImport implements OnEachRow, SkipsOnFailure, WithHeadingRow, WithStartRow, WithValidation
{

    use SkipsFailures;
    
    protected $userRepository;
    protected $errorRows = [];

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function startRow(): int
    {
        return 2;
    }

    public function onRow(Row $row)
    {
        $rowData = $row->toArray();

        $password = (string) $row['password'] ?? '123456';

        try {
            $data = [
                'id' => $rowData['id'] ?? null,
                'name' => $rowData['name'] ?? null,
                'email' => $rowData['email'] ?? null,
                'avatar' => $rowData['avatar'] ?? 'https://cdn01.justjared.com/wp-content/uploads/headlines/2023/04/netflix-secret-menu-evergreen.jpg',
                'status' => $rowData['status'] ?? true,
                'password' => Hash::make($password), 
            ];

            $dto = new UserDTO($data, true);
            
            $this->userRepository->createOrUpdate($dto->toArray());

        } catch (\Exception $e) {
            $this->addErrorRow($row->getIndex(), $rowData, 'Invalid data: ' . $e->getMessage());
        }

    }

    public function rules(): array
    {
        return [
            'id' => 'nullable|integer',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'avatar' => 'nullable|string',
            'password' => 'nullable',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'name.required' => 'Name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'The email has already been taken.',
        ];
    }

    protected function addErrorRow($rowIndex, $rowData, $errorMessage) {
        if(!isset($this->errorRows[$rowIndex])){
            $this->errorRows[$rowIndex] = [
                'row_data' => $rowData,
                'errors' => [],
            ];
        }
        $this->errorRows[$rowIndex]['errors'][] = $errorMessage;
    }

    public function getErrorRows()
    {
        return array_values($this->errorRows);
    }

    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $rowIndex = $failure->row();
            $rowData = $failure->values();
            foreach ($failure->errors() as $error) {
                $this->addErrorRow($rowIndex, $rowData, $error);
            }
        }
    }
}
