<?php
namespace App\Repositories;

use App\Models\User;

class UserRepository extends BaseRepository{

    public function __construct(User $user)
    {
        parent::__construct($user);
    }

    public function createOrUpdate(array $data): User
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'name' => $data['name'],
                'avatar' => $data['avatar'],
                'email' => $data['email'],
                'status' => $data['status'],
                'password' => $data['password'],
            ]
        );
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $query = $this->model->newQuery();

        $query->with('roles');

        if ($key && $search) {
            $query->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
        }
        
        return $query->paginate($perPage);
    }
}