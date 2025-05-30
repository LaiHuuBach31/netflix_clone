<?php

namespace App\Services;

use App\DTOs\SubscriptionDTO;
use App\Mapper\SubscriptionMapper;
use App\Repositories\PlanRepository;
use App\Repositories\SubscriptionRepository;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class SubscriptionService extends BaseService
{
    protected $planRepository;

    public function __construct(
        SubscriptionRepository $subscriptionRepository,
        PlanRepository $planRepository,
    ) {
        $this->repository = $subscriptionRepository;
        $this->planRepository = $planRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $Subscriptions = parent::getAll($key, $search, $perPage);
        $Subscriptions->getCollection()->transform(fn($Subscription) => SubscriptionMapper::fromModel($Subscription));
        return $Subscriptions;
    }

    public function findById(int $id)
    {
        $subscription = parent::findById($id);
        logger($subscription);
        return SubscriptionMapper::fromModel($subscription);
    }

    public function createSubscription(array $data)
    {
        $this->validateDuration($data);
        $dto = new SubscriptionDTO($data, true);
        $created = parent::create($dto);
        return SubscriptionMapper::fromModel($created);
    }

    public function updateSubscription(int $id, array $data)
    {
        $this->validateDuration($data);
        $dto = new SubscriptionDTO($data, true);
        $updated = parent::update($id, $dto);
        return SubscriptionMapper::fromModel($updated);
    }

    private function validateDuration(array $data)
    {
        $planId = $data['plan_id'];
        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);

        $plan = $this->planRepository->findById($planId);
        $durationDays = $plan->duration_days;

        $diffDays = $startDate->diffInDays($endDate);
      
        if ($diffDays != $durationDays) {
            throw new ValidationException(null, response()->json([
                'errors' => [
                    'end_date' => ["The duration must be exactly $durationDays days according to the selected service package."],
                ],
            ], 422));
        }
    }
}
