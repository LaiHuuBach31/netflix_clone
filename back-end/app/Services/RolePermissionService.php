<?php

namespace App\Services;

use App\DTOs\RolePermissionDTO;
use App\Mapper\RolePermissionMapper;
use App\Repositories\RolePermissionRepository;

class RolePermissionService extends BaseService
{
    public function __construct(RolePermissionRepository $rolePermissionRepository)
    {
        $this->repository = $rolePermissionRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $rolePermissions = parent::getAll($key, $search, $perPage);
        $rolePermissions->getCollection()->transform(fn($rolePermission) => RolePermissionMapper::fromModel($rolePermission));
        return $rolePermissions;
    }

    public function findById(int $id)
    {
        $rolePermission = parent::findById($id);
        return RolePermissionMapper::fromModel($rolePermission);
    }

    public function createRolePermission(array $data)
    {
        $dto = new RolePermissionDTO($data, true);
        $created = parent::create($dto);
        return RolePermissionMapper::fromModel($created);
    }

    public function updateRolePermission(int $id, array $data)
    {
        $dto = new RolePermissionDTO($data, true);
        $updated = parent::update($id, $dto);
        return RolePermissionMapper::fromModel($updated);
    }
}
