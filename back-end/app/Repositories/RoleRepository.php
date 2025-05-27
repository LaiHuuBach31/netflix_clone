<?php
namespace App\Repositories;

use App\Models\Role;

class RoleRepository extends BaseRepository{

    public function __construct(Role $role) {
        parent::__construct($role);
    }

    public function createOrUpdate(array $data): Role
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            ['name' => $data['name']]
        );
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $query = $this->model->newQuery();

        if ($key && $search) {
            $query->where($key, 'like', '%' . $search . '%');
        }
        
        return $query->with('permissions')->paginate($perPage);
    }
}