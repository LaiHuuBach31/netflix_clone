<?php

namespace App\Repositories;

use App\Models\Menu;

class MenuRepository extends BaseRepository
{

    public function __construct(Menu $menu)
    {
        parent::__construct($menu);
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $query = $this->model->newQuery();

        $query->where('parent_id', 0);

        if ($key && $search) {
            $query->where($key, 'like', '%' . $search . '%');
        }
        
        $query->with('children');
        
        return $query->paginate($perPage);
    }

    function createOrUpdate(array $data): Menu 
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'title' => $data['title'],
                'parent_id' => $data['parent_id'],
                'order' => $data['order'],
                'is_active' => $data['is_active'],
            ]
        );
    }
}
