<?php
namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UserDTO extends BaseDTO{
    public function __construct(array $data, bool $validate = false) {
        
        if($validate){
            $validator = Validator::make($data, [
                'name' => 'required|string' ,
                'avatar' => 'nullable' ,
                'email' => 'required|unique:users,email|string' ,
                'password' => 'required|string',
            ]);

            if($validator->fails()){
                throw new ValidationException($validator);
            }
        }

        parent::__construct($data);
    }
}