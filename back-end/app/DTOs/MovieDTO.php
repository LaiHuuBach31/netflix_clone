<?php

namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class MovieDTO extends BaseDTO
{

    public function __construct(array $data, bool $validate = false) 
    {
        if($validate){
            $id = $data['id'] ?? null;
            $validate = Validator::make($data, [
                'title' => 'required|string|max:225' . $id,
                'description' => 'nullable',
                'thumbnail' => 'required|string|max:225',
                'video_url' => 'required|string|max:225',
                'release_year' => 'required',
                'is_featured' => 'required',
                'genre_id' => 'required',
            ]);

            if($validate->fails()){
                throw new ValidationException($validate);
            }
        }

        parent::__construct($data);
    }
}
