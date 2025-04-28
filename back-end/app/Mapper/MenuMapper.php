<?php
    namespace App\Mapper;

use App\DTOs\MenuDTO;
use App\Models\Menu;

class MenuMapper extends BaseMapper{
    protected static string $dto = MenuDTO::class;
    protected static string $class = Menu::class;
}