<?php

namespace App\Repositories;

use App\Models\Subscription;

class SubscriptionRepository extends BaseRepository
{

    public function __construct(Subscription $subscription)
    {
        parent::__construct($subscription);
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
