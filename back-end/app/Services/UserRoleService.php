<?php
namespace App\Services;

use App\DTOs\UserRoleDTO;
use App\Mapper\UserRoleMapper;
use App\Repositories\UserRoleRepository;

class UserRoleService extends BaseService{

    public function __construct(UserRoleRepository $userRoleRepository)
    {
        $this->repository = $userRoleRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $userRoles = parent::getAll($key, $search, $perPage);
        $userRoles->getCollection()->transform(fn($userRole) => UserRoleMapper::fromModel($userRole));
        return $userRoles;
    }

    public function findById(int $id)
    {
        $userRole = parent::findById($id);
        return UserRoleMapper::fromModel($userRole);
    }

    public function createUserRole(array $data)
    {
        $dto = new UserRoleDTO($data, true);
        $created = parent::create($dto);
        return UserRoleMapper::fromModel($created);
    }

    public function updateUserRole(int $id, array $data)
    {
        $dto = new UserRoleDTO($data, true);
        $updated = parent::update($id, $dto);
        return UserRoleMapper::fromModel($updated);
    }
}