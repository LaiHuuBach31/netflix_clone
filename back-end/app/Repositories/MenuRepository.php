<?php

namespace App\Repositories;

use App\Models\Menu;

class MenuRepository extends BaseRepository
{

    public function __construct(Menu $menu)
    {
        parent::__construct($menu);
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
