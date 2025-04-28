<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponses
{
    public function successResponse(
        mixed $data = null,
        string $message = 'Request successful',
        int $statusCode = Response::HTTP_OK
    ): JsonResponse {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    public function errorResponse(
        mixed $errors = null,
        string $message = 'Something went wrong',
        int $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR
    ): JsonResponse {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }

    public function okResponse(mixed $data, string $message = 'Success'): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }
    

    public function createdResponse(mixed $data = null, string $message = 'Created'): JsonResponse
    {
        return $this->successResponse($data, $message, Response::HTTP_CREATED);
    }

    public function noContentResponse(string $message = 'No Content'): JsonResponse
    {
        return $this->successResponse(null, $message, Response::HTTP_NO_CONTENT);
    }

    public function badRequestResponse(mixed $errors = null, string $message = 'Bad Request'): JsonResponse
    {
        return $this->errorResponse($errors, $message, Response::HTTP_BAD_REQUEST);
    }

    public function unauthorizedResponse(mixed $errors = null, string $message = 'Unauthorized'): JsonResponse
    {
        return $this->errorResponse($errors, $message, Response::HTTP_UNAUTHORIZED);
    }

    public function forbiddenResponse(mixed $errors = null, string $message = 'Forbidden'): JsonResponse
    {
        return $this->errorResponse($errors, $message, Response::HTTP_FORBIDDEN);
    }

    public function notFoundResponse(mixed $errors = null, string $message = 'Not Found'): JsonResponse
    {
        return $this->errorResponse($errors, $message, Response::HTTP_NOT_FOUND);
    }

    public function conflictResponse(mixed $errors = null, string $message = 'Conflict'): JsonResponse
    {
        return $this->errorResponse($errors, $message, Response::HTTP_CONFLICT);
    }

    public function unprocessableResponse(mixed $errors = null, string $message = 'Unprocessable'): JsonResponse
    {
        return $this->errorResponse($errors, $message, Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
