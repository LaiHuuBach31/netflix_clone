<?php
namespace App\Mapper;

use App\DTOs\PlanDTO;
use App\Models\Plan;

class PlanMapper extends BaseMapper {
    protected static string $dto = PlanDTO::class;
    protected static string $class = Plan::class;
}