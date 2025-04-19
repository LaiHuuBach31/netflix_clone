<?php

namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class GenreDTO extends BaseDTO {
    public ?int $id;
    public string $name;

    public function __construct(array $data) {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:225'
        ]);
        
        if($validator->fails()){
            throw new ValidationException($validator);
        }
        $this->id = $data['id'] ?? null;
        $this->name = $data['name'];

    }

    function toArray() : array {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }

}
