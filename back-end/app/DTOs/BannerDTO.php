<?php
    namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class BannerDTO extends BaseDTO{
    
    public function __construct(array $data, bool $validate = false) {

        if ($validate) {
            $id = $data['id'] ?? null;
            $validator = Validator::make($data, [
                'title' => 'nullable',
                'image' => 'required',
                'movie_id' => 'required',
                'is_active' => 'required',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }
       
        parent::__construct($data);

    }
}