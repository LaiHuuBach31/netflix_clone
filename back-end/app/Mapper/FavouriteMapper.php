<?php
namespace App\Mapper;

use App\DTOs\FavouriteDTO;
use App\Models\Favourite;

class FavouriteMapper extends BaseMapper{
    protected static string $dto = FavouriteDTO::class;
    protected static string $class = Favourite::class;
}