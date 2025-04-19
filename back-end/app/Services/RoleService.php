<?php
    namespace App\Services;

use App\DTOs\RoleDTO;
use App\Mapper\GenreMapper;
use App\Repositories\RoleRepository;

class RoleService extends BaseService {

    public function __construct(RoleRepository $roleRepository)
    {
        $this->repository = $roleRepository;
    }

    public function getAll()
    {
        $roles = parent::getAll();
        return $roles->map(fn($role) => GenreMapper::fromModel($role));
    }

    public function findById(int $id)
    {
        $genre = parent::findById($id);
        return GenreMapper::fromModel($genre);
    }

    public function createRole(array $data)
    {
        $dto = new RoleDTO($data, true);
        $created = parent::create($dto);
        return GenreMapper::fromModel($created);
    }

    public function updateRole(int $id, array $data)
    {
        $dto = new RoleDTO($data, true);
        $updated = parent::update($id, $dto);
        return GenreMapper::fromModel($updated);
    }
}