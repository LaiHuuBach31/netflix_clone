<?php
    namespace App\Services;

use App\DTOs\RoleDTO;
use App\Mapper\RoleMapper;
use App\Repositories\RoleRepository;

class RoleService extends BaseService {

    public function __construct(RoleRepository $roleRepository)
    {
        $this->repository = $roleRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $roles = parent::getAll($key, $search, $perPage);
        $roles->getCollection()->transform(fn($role) => RoleMapper::fromModel($role));
        return $roles;
    }

    public function findById(int $id)
    {
        $genre = parent::findById($id);
        return RoleMapper::fromModel($genre);
    }

    public function createRole(array $data)
    {
        $dto = new RoleDTO($data, true);
        $created = parent::create($dto);
        return RoleMapper::fromModel($created);
    }

    public function updateRole(int $id, array $data)
    {
        $dto = new RoleDTO($data, true);
        $updated = parent::update($id, $dto);
        return RoleMapper::fromModel($updated);
    }
}