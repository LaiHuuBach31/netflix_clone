<?php
namespace App\Repositories;

use App\Models\Plan;

class PlanRepository extends BaseRepository{

    public function __construct(Plan $plan) {
        parent::__construct($plan);
    }

    public function createOrUpdate(array $data): Plan
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'name' => $data['name'],
                'price' => $data['price'],
                'duration_days' => $data['duration_days'],
                'description' => $data['description']
            ]
        );
    }
}