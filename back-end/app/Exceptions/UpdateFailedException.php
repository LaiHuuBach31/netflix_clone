<?php

namespace App\Exceptions;

use Exception;
use Throwable;

class UpdateFailedException extends Exception
{
    public function __construct(string $message = "Failed to update resource", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
