<?php
namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class RatingDTO extends BaseDTO{
    
    public function __construct(array $data, bool $validate = false) 
    {
        if($validate){
            $id = $data['id'] ?? null;
            $validate = Validator::make($data, [
                'user_id' => 'required',
                'movie_id' => 'required',
                'rating' => 'required',
                'comment' => 'required',
            ]);

            if($validate->fails()){
                throw new ValidationException($validate);
            }
        }

        parent::__construct($data);
    }
}