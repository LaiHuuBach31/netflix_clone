<?php
namespace App\Repositories;

use App\Models\Role;

class RoleRepository extends BaseRepository{

    public function __construct(Role $role) {
        parent::__construct($role);
    }

    public function createOrUpdate(array $data): Role
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            ['name' => $data['name']]
        );
    }
}