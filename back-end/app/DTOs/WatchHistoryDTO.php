<?php
namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class WatchHistoryDTO extends BaseDTO{
    public function __construct(array $data, bool $validate = false) 
    {
        if($validate){
            $id = $data['id'] ?? null;
            $validate = Validator::make($data, [
                'user_id' => 'required',
                'movie_id' => 'required',
                'watched_at' => 'required',
                'progress' => 'required'
            ]);

            if($validate->fails()){
                throw new ValidationException($validate);
            }
        }

        parent::__construct($data);
    }
}