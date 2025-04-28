<?php  
    namespace App\DTOs;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class MenuDTO extends BaseDTO{

    public function __construct(array $data, bool $validate = false) {
        
        if($validate){
            $id = $data['id'] ?? null;
            $validator = Validator::make($data, [
                'title' => 'required|string|max:225|unique:menus,title,' . $id,
                'parent_id' => 'nullable|integer|min:0',
                'order' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
            ]);

            if($validator->fails()){
                throw new ValidationException($validator);
            }
        }

        parent::__construct($data);
    }

}