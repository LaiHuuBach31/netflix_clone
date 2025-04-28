<?php

namespace App\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

abstract class BaseRepository
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $query = $this->model->newQuery();

        if ($key && $search) {
            $query->where($key, 'like', '%' . $search . '%');
        }
        
        return $query->paginate($perPage);
    }


    function findById(int $id): Model
    {
        return $this->model->findOrFail($id);
    } 
    
    function createOrUpdate(array $data): Model
    {
        $id = $data['id'] ?? null;
        return $this->model->updateOrCreate(
            ['id' => $id],
            array_filter($data, fn($key) => $key !== 'id', ARRAY_FILTER_USE_KEY)
        );
    }

    function delete(int $id): bool
    {
        $model = $this->model->findOrFail($id);
        return $model->delete();
    }
}
