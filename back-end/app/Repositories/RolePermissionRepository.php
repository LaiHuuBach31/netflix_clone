<?php

namespace App\Repositories;

use App\Models\RolePermission;

class RolePermissionRepository extends BaseRepository
{
    public function __construct(RolePermission $rolePermission)
    {
        parent::__construct($rolePermission);
    }

    public function createOrUpdate(array $data): RolePermission
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'permission_id' => $data['permission_id'],
                'role_id' => $data['role_id'],
            ]
        );
    }
}
