<?php
namespace App\Mapper;

use App\DTOs\SubscriptionDTO;
use App\Models\Subscription;

class SubscriptionMapper extends BaseMapper{
    protected static string $dto = SubscriptionDTO::class;
    protected static string $class = Subscription::class;
}