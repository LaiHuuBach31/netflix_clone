<?php
namespace App\Mapper;

use App\DTOs\RatingDTO;
use App\Models\Rating;

class RatingMapper extends BaseMapper{
    protected static string $dto = RatingDTO::class;
    protected static string $class = Rating::class;
}