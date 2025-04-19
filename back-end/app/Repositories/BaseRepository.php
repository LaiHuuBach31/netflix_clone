<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    function getAll() : Collection {
        return $this->model->all();
    }

    function findById(int $id) : Model {
        return $this->model->findOrFail($id);
    } 
    
    function createOrUpdate(array $data) : Model {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            array_filter($data, fn($key) => $key !== 'id', ARRAY_FILTER_USE_KEY)
        );
    }

    function delete(int $id) : bool {
        $model = $this->model->findOrFail($id);
        return $model->delete();
    }
}
