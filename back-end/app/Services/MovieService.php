<?php

namespace App\Services;

use App\DTOs\MovieDTO;
use App\Mapper\MovieMapper;
use App\Repositories\MovieRepository;

class MovieService extends BaseService
{

    public function __construct(MovieRepository $movieRepository)
    {
        $this->repository = $movieRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $movies = parent::getAll($key, $search, $perPage);
        $movies->getCollection()->transform(fn($movie) => MovieMapper::fromModel($movie));
        return $movies;
    }

    public function findById($id)
    {
        $movie = parent::findById($id);
        return MovieMapper::fromModel($movie);
    }

    public function createMovie(array $data)
    {
        $dto = new MovieDTO($data, true);
        $created = parent::create($dto);
        return MovieMapper::fromModel($created);
    }

    public function updateMovie(int $id, array $data)
    {
        $dto = new MovieDTO($data, true);
        $updated = parent::update($id, $dto);
        return MovieMapper::fromModel($updated);
    }
}
