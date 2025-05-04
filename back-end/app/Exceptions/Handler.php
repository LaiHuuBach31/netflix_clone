<?php

namespace App\Exceptions;

use App\Traits\ApiResponses;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Throwable;

class Handler extends ExceptionHandler
{

    use ApiResponses;

    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {

        $this->renderable(function (ResourceNotFoundException $e, $request) {
            return $this->notFoundResponse([], $e->getMessage());
        });

        $this->renderable(function (CreationFailedException  $e, $request) {
            return $this->unprocessableResponse([], $e->getMessage());
        });

        $this->renderable(function (UpdateFailedException $e, $request) {
            return $this->unprocessableResponse([], $e->getMessage());
        });

        $this->renderable(function (DeletionFailedException $e, $request) {
            return $this->unprocessableResponse([], $e->getMessage());
        });

        $this->renderable(function (ModelNotFoundException $e, $request) {
            return $this->notFoundResponse([], 'Resource not found');
        });

        $this->renderable(function (Throwable $e, $request) {
            return $this->errorResponse([], $e->getMessage());
        });

        $this->renderable(function (AuthenticationException $e, $request) {
            return $this->unauthorizedResponse([], 'Unauthenticated');
        });
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return $this->unauthorizedResponse([], 'Unauthorized');
    }
}
