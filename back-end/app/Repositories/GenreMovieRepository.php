<?php

namespace App\Repositories;

use App\Models\GenreMovie;

class GenreMovieRepository extends BaseRepository
{
    public function __construct(GenreMovie $genreMovie)
    {
        parent::__construct($genreMovie);
    }

    public function createOrUpdate(array $data): GenreMovie
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'genre_id' => $data['genre_id'],
                'movie_id' => $data['movie_id'],
            ]
        );
    }
}
