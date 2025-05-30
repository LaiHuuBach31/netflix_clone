<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

abstract class BaseController extends Controller
{
    use ApiResponses;

    protected function handleValidationException(ValidationException $e): JsonResponse
    {
        return $this->unprocessableResponse($e->errors(), 'Validation failed');
    }

    protected function handleIndex($service, ?string $key = null, ?string $search = null, int $perPage = 10): JsonResponse
    {
        $items = $service->getAll($key, $search, $perPage);
        return $this->successResponse($items);
    }

    protected function handleShow($service, int $id): JsonResponse
    {
        $item = $service->findById($id);
        return $this->successResponse($item);
    }

    protected function handleDelete($service, int $id, string $resourceName): JsonResponse
    {
        $service->delete($id);
        return $this->successResponse(['message' => "$resourceName deleted successfully"]);
    }
}
