<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PlanService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PlanController extends BaseController
{
    protected $planService;

    public function __construct(PlanService $planService) {
        $this->planService = $planService;
    }

    public function index()
    {
        return $this->handleIndex($this->planService);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->planService, $id);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        try {
            $role = $this->planService->createPlan($data);
            return $this->createdResponse($role, 'Plan created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = $request->all();
        try {
            $role = $this->planService->updatePlan($id, $data);
            return $this->okResponse($role, 'Plan updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->planService, $id, 'Plan');
    }
}
