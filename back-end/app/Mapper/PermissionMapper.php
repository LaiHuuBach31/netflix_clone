<?php
namespace App\Mapper;

use App\DTOs\PermissionDTO;
use App\Models\Permission;

class PermissionMapper extends BaseMapper{
    protected static string $dto = PermissionDTO::class;
    protected static string $class = Permission::class;
}