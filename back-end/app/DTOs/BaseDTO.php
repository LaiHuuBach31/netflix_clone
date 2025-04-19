<?php

namespace App\DTOs;

abstract class BaseDTO
{
    abstract public function toArray(): array;
}
