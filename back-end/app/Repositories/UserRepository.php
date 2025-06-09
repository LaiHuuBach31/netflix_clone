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
        $id = $data['id'] ?? null;
        $filteredData = array_filter($data, fn($key) => $key !== 'id', ARRAY_FILTER_USE_KEY);
        if (!isset($filteredData['password'])) {
            unset($filteredData['password']);
        }
        return $this->model->updateOrCreate(
            ['id' => $id],
            $filteredData
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

    public function getDataExport() {
        return $query = $this->model->get();
    }
}