<?php
namespace App\Services;

use App\DTOs\UserDTO;
use App\Mapper\UserMapper;
use App\Repositories\UserRepository;

class UserService extends BaseService{

    public function __construct(UserRepository $userRepository)
    {
        $this->repository = $userRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $users = parent::getAll($key, $search, $perPage);
        $users->getCollection()->transform(fn($user) => UserMapper::fromModel($user));
        return $users;
    }

    public function findById(int $id)
    {
        $user = parent::findById($id);
        return UserMapper::fromModel($user);
    }

    public function createUser(array $data)
    {
        $dto = new UserDTO($data, true);
        $created = parent::create($dto);
        return UserMapper::fromModel($created);
    }

    public function updateUser(int $id, array $data)
    {
        $dto = new UserDTO($data, true);
        $updated = parent::update($id, $dto);
        return UserMapper::fromModel($updated);
    }
}