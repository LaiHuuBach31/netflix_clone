<?php

use App\DTOs\BaseDTO;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CommentDTO extends BaseDTO{
    public function __construct(array $data, bool $validate = false) {

        if ($validate) {
            $id = $data['id'] ?? null;
            $validator = Validator::make($data, [
                'user_id' => 'required',
                'movie_id' => 'required',
                'content' => 'required',
                'parent_id' => 'required',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }
       
        parent::__construct($data);

    }
}