<?php

namespace App\Services;

use App\DTOs\SubscriptionDTO;
use App\Mapper\SubscriptionMapper;
use App\Repositories\SubscriptionRepository;

class SubscriptionService extends BaseService
{
    public function __construct(SubscriptionRepository $subscriptionRepository)
    {
        $this->repository = $subscriptionRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $Subscriptions = parent::getAll($key, $search, $perPage);
        $Subscriptions->getCollection()->transform(fn($Subscription) => SubscriptionMapper::fromModel($Subscription));
        return $Subscriptions;
    }

    public function findById(int $id)
    {
        $genre = parent::findById($id);
        return SubscriptionMapper::fromModel($genre);
    }

    public function createSubscription(array $data)
    {
        $dto = new SubscriptionDTO($data, true);
        $created = parent::create($dto);
        return SubscriptionMapper::fromModel($created);
    }

    public function updateSubscription(int $id, array $data)
    {
        $dto = new SubscriptionDTO($data, true);
        $updated = parent::update($id, $dto);
        return SubscriptionMapper::fromModel($updated);
    }
    
}
