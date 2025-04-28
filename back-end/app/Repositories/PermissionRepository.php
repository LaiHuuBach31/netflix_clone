<?php
namespace App\Repositories;

use App\Models\Permission;

class PermissionRepository extends BaseRepository{

    public function __construct(Permission $permissions) {
        parent::__construct($permissions);
    }

    public function createOrUpdate(array $data): Permission
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            ['name' => $data['name']]
        );
    }
}