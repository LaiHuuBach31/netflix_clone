<?php
namespace App\Mapper;

use App\DTOs\GenreDTO;
use App\Models\Genre;

class GenreMapper extends BaseMapper{
    protected static string $dto = GenreDTO::class;
    protected static string $class = Genre::class;
}