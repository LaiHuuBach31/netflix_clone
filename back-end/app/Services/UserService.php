<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\Exports\UsersExport;
use App\Imports\UsersImport;
use App\Mapper\UserMapper;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class UserService extends BaseService
{

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

    public function findByEmail(string $email)
    {
        try {
            $user = $this->repository->getUserByEmail($email);
            if($user){
                return UserMapper::fromModel($user);
            } else{
                throw new ResourceNotFoundException('Resource not found with ID: ' . $email);
            }
        } catch (ModelNotFoundException $e) {
            throw new ResourceNotFoundException('Resource not found with ID: ' . $email);
        } catch (\Exception $e) {
            throw new Exception('Failed to find resource: ' . $e->getMessage());
        }
    }

    public function createUser(array $data)
    {
        $data = [
            'name' => $data['name'],
            'avatar' => $data['avatar'],
            'email' => $data['email'],
            'status' => true,
            'password' => bcrypt($data['password']),
        ];
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

    public function exportUsers()
    {
        return Excel::download(new UsersExport($this->repository), 'users.xlsx');
    }

    public function importUsers($file)
    {
        $import = new UsersImport($this->repository);
        Excel::import($import, $file);
        return $import->getErrorRows();
    }
}
