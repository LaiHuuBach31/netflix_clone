<?php

namespace App\Repositories;

use App\Models\UserRole;

class UserRoleRepository extends BaseRepository
{
    public function __construct(UserRole $userRole)
    {
        parent::__construct($userRole);
    }

    public function createOrUpdate(array $data): UserRole
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'user_id' => $data['user_id'],
                'role_id' => $data['role_id'],
            ]
        );
    }
}
