<?php
    namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class GenreMovieDTO extends BaseDTO{
    public function __construct(array $data, bool $validate = false) {

        if ($validate) {
            $id = $data['id'] ?? null;
            $validator = Validator::make($data, [
                'genre_id' => 'required',
                'movie_id' => 'required',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }
       
        parent::__construct($data);

    }
}