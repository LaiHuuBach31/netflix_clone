<?php
namespace App\Mapper;

use App\DTOs\RolePermissionDTO;
use App\Models\RolePermission;

class RolePermissionMapper extends BaseMapper{
    protected static string $dto = RolePermissionDTO::class;
    protected static string $class = RolePermission::class;
}
