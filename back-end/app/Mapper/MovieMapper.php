<?php
namespace App\Mapper;

use App\DTOs\MovieDTO;
use App\Models\Movie;

class MovieMapper extends BaseMapper{
    protected static string $dto = MovieDTO::class;
    protected static string $class = Movie::class;
}