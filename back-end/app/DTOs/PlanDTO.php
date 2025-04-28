<?php
namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class PlanDTO extends BaseDTO {
    public function __construct(array $data, bool $validate = false) {

        if ($validate) {
            $validator = Validator::make($data, [
                'name' => 'required|string|max:225',
                'price' => 'required|numeric|min:0',
                'duration_days' => 'required',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }
       
        parent::__construct($data);

    }
}