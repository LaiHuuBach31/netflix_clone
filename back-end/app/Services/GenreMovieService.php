<?php

namespace App\Services;

use App\DTOs\GenreMovieDTO;
use App\Mapper\GenreMovieMapper;
use App\Repositories\GenreMovieRepository;

class GenreMovieService extends BaseService
{
    public function __construct(GenreMovieRepository $genreMovieRepository)
    {
        $this->repository = $genreMovieRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $genreMovies = parent::getAll($key, $search, $perPage);
        $genreMovies->getCollection()->transform(fn($genreMovie) => GenreMovieMapper::fromModel($genreMovie));
        return $genreMovies;
    }

    public function findById($id)
    {
        $genreMovie = parent::findById($id);
        return GenreMovieMapper::fromModel($genreMovie);
    }

    public function createGenreMovie(array $data)
    {
        $dto = new GenreMovieDTO($data, true);
        $created = parent::create($dto);
        return GenreMovieMapper::fromModel($created);
    }

    public function updateGenreMovie(int $id, array $data)
    {
        $dto = new GenreMovieDTO($data, true);
        $updated = parent::update($id, $dto);
        return GenreMovieMapper::fromModel($updated);
    }
}
