<?php
namespace App\Mapper;

use App\DTOs\GenreDTO;
use App\Models\Genre;

class GenreMapper {

    public static function fromModel(Genre $genre) : GenreDTO {
        return new GenreDTO([
            'id' => $genre->id,
            'name' => $genre->name,
        ]);
    }

    public static function toModel(GenreDTO $dto, ?Genre $genre = null) : Genre {
        $genre = $genre ?? new Genre();
        $genre->name = $dto->name;
        return $genre;
    }

    public static function toDTO(array $data): GenreDTO
    {
        return new GenreDTO([
            'id' => $data['id'] ?? null,
            'name' => $data['name'] ?? null,
        ]);
    }
}