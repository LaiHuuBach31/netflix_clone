<?php

use App\DTOs\BaseDTO;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class EpisodesDTO extends BaseDTO
{
    public function __construct(array $data, bool $validate = false)
    {
        if ($validate) {
            $id = $data['id'] ?? null;
            $validator = Validator::make($data, [
                'title'=> 'required|string|max:255', 
                'episode_number' => 'required|integer|min:1', 
                'thumbnail' => 'nullable|string|max:2048', 
                'video_url' => 'required|string|max:2048',
                'duration' => 'required|integer|min:0',  
                'movie_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }

        parent::__construct($data);
    }
}
