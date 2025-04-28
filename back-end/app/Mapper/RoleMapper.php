<?php
namespace App\Mapper;

use App\DTOs\RoleDTO;
use App\Models\Role;

class RoleMapper extends BaseMapper{
    protected static string $dto = RoleDTO::class;
    protected static string $class = Role::class;
}