<?php

namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class GenreDTO extends BaseDTO {

    public function __construct(array $data, bool $validate = false) {

        if ($validate) {
            $validator = Validator::make($data, [
                'name' => 'required|unique:genres,name|string|max:225'
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }
       
        parent::__construct($data);

    }

}
