<?php
namespace App\Mapper;

use App\DTOs\GenreMovieDTO;
use App\Models\GenreMovie;

class GenreMovieMapper extends BaseMapper{
    protected static string $dto = GenreMovieDTO::class;
    protected static string $class = GenreMovie::class;
}