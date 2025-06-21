<?php

namespace App\Services;

use App\DTOs\SubscriptionDTO;
use App\Mapper\SubscriptionMapper;
use App\Models\Subscription;
use App\Repositories\PlanRepository;
use App\Repositories\SubscriptionRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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

    public function getSubscriptionByUser(int $userId)
    {
        $subscriptions = $this->repository->getSubscriptionByUser($userId);
        return SubscriptionMapper::fromModel($subscriptions);
    }

    public function findById(int $id)
    {
        $subscription = parent::findById($id);
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
        $subscription = Subscription::find($id);

        if (!$subscription) {
            throw new ModelNotFoundException('Subscription not found with ID: ' . $id);
        }

        $mergedData = [
            'id' => $id,
            'user_id' => $data['user_id'] ?? $subscription->user_id,
            'plan_id' => $data['plan_id'] ?? $subscription->plan_id,
            'start_date' => $data['start_date'] ?? $subscription->start_date,
            'end_date' => $data['end_date'] ?? $subscription->end_date,
            'status' => $data['status'] ?? $subscription->status,
        ];

        $dto = new SubscriptionDTO($mergedData, true);
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
