<?php
namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SubscriptionDTO extends BaseDTO{
    
    public function __construct(array $data, bool $validate = false) {

        if ($validate) {
            $id = $data['id'] ?? null;
            $validator = Validator::make($data, [
                'user_id' => 'required',
                'plan_id' => 'required',
                'start_date' => 'required|date|date_format:Y-m-d',
                'end_date' => 'required|date|after_or_equal:start_date',
                'status' => 'required',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }
       
        parent::__construct($data);

    }
}