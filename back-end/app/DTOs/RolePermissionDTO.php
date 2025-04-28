<?php
namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class RolePermissionDTO extends BaseDTO{
    
    public function __construct(array $data, bool $validate = false) {

        if ($validate) {
            $id = $data['id'] ?? null;
            $validator = Validator::make($data, [
                'permission_id' => 'required',
                'role_id' => 'required',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }
       
        parent::__construct($data);

    }
}