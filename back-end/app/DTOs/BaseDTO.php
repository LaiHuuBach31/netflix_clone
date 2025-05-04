<?php

namespace App\DTOs;

use ArrayAccess;
use JsonSerializable;

abstract class BaseDTO implements ArrayAccess, JsonSerializable
{
    protected array $attributes = [];

    public function __construct(array $data = []) {
        $this->attributes = $data;
    }

    public function toArray() : array {
        return $this->attributes;
    }

    //overide
    public function jsonSerialize(): mixed {
        return $this->toArray();
    }

    public function __get($key) {
        return $this->attributes[$key] ?? null;
    }

    public function __set($key, $value) {
        $this->attributes[$key] = $value;
    }

    public function offsetExists(mixed $offset): bool
    {
        return isset($this->attributes[$offset]);
    }

    public function offsetGet($offset): mixed
    {
        return $this->attributes[$offset] ?? null;
    }

    public function offsetSet($offset, $value): void
    {
        $this->attributes[$offset] = $value;
    }

    public function offsetUnset($offset): void
    {
        unset($this->attributes[$offset]);
    }

    public function has($key): bool
    {
        return isset($this->attributes[$key]);
    }
}
