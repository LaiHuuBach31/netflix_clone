<?php 
namespace App\Services;

use App\DTOs\PermissionDTO;
use App\Mapper\PermissionMapper;
use App\Repositories\PermissionRepository;

class PermissionService extends BaseService{

    public function __construct(PermissionRepository $permissionRepository)
    {
        $this->repository = $permissionRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $permissions = parent::getAll($key, $search, $perPage);
        $permissions->getCollection()->transform(fn($permission) => PermissionMapper::fromModel($permission));
        return $permissions;
    }

    public function findById(int $id)
    {
        $genre = parent::findById($id);
        return PermissionMapper::fromModel($genre);
    }

    public function createPermission(array $data)
    {
        $dto = new PermissionDTO($data, true);
        $created = parent::create($dto);
        return PermissionMapper::fromModel($created);
    }

    public function updatePermission(int $id, array $data)
    {
        $dto = new PermissionDTO($data, true);
        $updated = parent::update($id, $dto);
        return PermissionMapper::fromModel($updated);
    }
}