<?php 
namespace App\Mapper;

use App\DTOs\UserDTO;
use App\Models\User;

class UserMapper extends BaseMapper{
    protected static string $dto = UserDTO::class;
    protected static string $class = User::class;
}