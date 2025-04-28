<?php

namespace App\Mapper;

use Illuminate\Database\Eloquent\Model;
use App\DTOs\BaseDTO;

abstract class BaseMapper
{
    protected static string $dto;
    protected static string $model;

    public static function fromModel(Model $model) : BaseDTO {
        return new static::$dto($model->toArray());
    }

    public static function toModel(BaseDTO $dto, ?Model $model = null) : Model {

        $model = $model ?? new static::$model;

        foreach ($dto->toArray() as $key => $value) {
            if(in_array($key, $model->getFillable())){
                $model->$key = $value;
            }
        }

        return $model;
    }

    public static function toDTO(array $data) : BaseDTO {
        return new static::$dto($data);
    }
}