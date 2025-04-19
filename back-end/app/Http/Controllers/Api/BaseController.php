<?php
namespace App\Http\Controllers\Api;

use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

abstract class BaseController {

    use ApiResponses;

    protected function handleValidationException(ValidationException $e) : JsonResponse{
        return $this->unprocessableResponse($e->errors(), 'Validation failed');
    }

    protected function handleIndex($service) : JsonResponse  {
        $item = $service->getAll();
        return $this->successResponse($item);
    }

    protected function handleShow($service, int $id) : JsonResponse  {
        $item = $service->findById($id);
        return $this->successResponse($item);
    }

    protected function handleCreate($service, Request $request, string $resourceName) : JsonResponse {
        try {
            $item = $service->create($request->all());
            return $this->successResponse($item->toArray(), "$resourceName created successfully", 201);
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }
}