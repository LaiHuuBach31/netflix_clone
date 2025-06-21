<?php

namespace App\Repositories;

use App\Models\Subscription;

class SubscriptionRepository extends BaseRepository
{

    public function __construct(Subscription $subscription)
    {
        parent::__construct($subscription);
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $query = $this->model->newQuery();

        if ($key && $search) {
            $query->where($key, 'like', '%' . $search . '%');
        }

        $query->with('user', 'plan');
        
        return $query->paginate($perPage);
    }

    public function getSubscriptionByUser(int $userId): ?Subscription
    {
        return $this->model->where('user_id', $userId)->latest()->where('status', 1)->first();
        
    }

    public function createOrUpdate(array $data): Subscription
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'user_id' => $data['user_id'],
                'plan_id' => $data['plan_id'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'status' => $data['status'],
            ]
        );
    }

}
