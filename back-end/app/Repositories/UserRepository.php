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
                'email' => $data['email'],
                'password' => $data['password'],
            ]
        );
    }
}