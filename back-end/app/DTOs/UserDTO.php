<?php
namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UserDTO extends BaseDTO{
    public function __construct(array $data, bool $validate = false) {
        
        if($validate){
            $id = $data['id'] ?? null;
            $validator = Validator::make($data, [
                'name' => 'required|string' ,
                'avatar' => 'nullable' ,
                'status' => 'required' ,
                'email' => 'required|string|unique:users,email,'. $id ,
                'password' => 'required|string',
            ]);

            if($validator->fails()){
                throw new ValidationException($validator);
            }
        }

        parent::__construct($data);
    }
}