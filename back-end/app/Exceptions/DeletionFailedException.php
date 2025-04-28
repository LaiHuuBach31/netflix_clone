<?php

namespace App\Exceptions;

use Exception;
use Throwable;

class DeletionFailedException extends Exception
{
    public function __construct(string $message = "Failed to delete resource", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
