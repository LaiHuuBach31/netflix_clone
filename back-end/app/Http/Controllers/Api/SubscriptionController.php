<?php

namespace App\Http\Controllers\Api;

use App\Services\SubscriptionService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SubscriptionController extends BaseController
{
    protected $subscriptionService;
    protected $userService;

    public function __construct(
        SubscriptionService $subscriptionService,
        UserService $userService,
    ) {
        $this->subscriptionService = $subscriptionService;
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->subscriptionService, 'name', $search, $perPage);
    }

    public function getSubscriptionByUser($user_id)
    {
        $subscription = $this->subscriptionService->getSubscriptionByUser($user_id);
        if ($subscription) {
            return $this->okResponse($subscription, 'Subscription retrieved successfully');
        }
        return $this->notFoundResponse('No subscription found for this user');
    }

    public function show(int $id)
    {
        return $this->handleShow($this->subscriptionService, $id);
    }

    public function store(Request $request)
    {
        if ($request->email) {
            $user = $this->userService->findByEmail($request->email);
            $data = [
                "user_id" => $user->id,
                "plan_id" => $request->plan_id,
                "start_date" => $request->start_date ?? now()->toDateString(),
                "end_date" => $request->end_date,
                "status" => $request->status ?? true,
            ];
        } else {
            $data = [
                "user_id" => $request->user_id,
                "plan_id" => $request->plan_id,
                "start_date" => $request->start_date ?? now()->toDateString(),
                "end_date" => $request->end_date,
                "status" => $request->status ?? true,
            ];
        }

        try {
            $subscription = $this->subscriptionService->createSubscription($data);
            return $this->createdResponse($subscription, 'Subscription created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(['id' => $id], $request->all());
        try {
            $subscription = $this->subscriptionService->updateSubscription($id, $data);
            return $this->okResponse($subscription, 'Subscription updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->subscriptionService, $id, 'Subscription');
    }
}
