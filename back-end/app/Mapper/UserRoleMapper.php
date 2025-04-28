<?php
namespace App\Mapper;

use App\DTOs\UserRoleDTO;
use App\Models\UserRole;

class UserRoleMapper extends BaseMapper{
    protected static string $dto = UserRoleDTO::class;
    protected static string $class = UserRole::class;
}