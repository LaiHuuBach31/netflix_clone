<?php
    namespace App\Services;

use App\DTOs\GenreDTO;
use App\Mapper\GenreMapper;
use App\Repositories\GenreRepository;

class GenreService extends BaseService
{
    public function __construct(GenreRepository $genreRepository)
    {
        $this->repository = $genreRepository;
    }

    public function getAll()
    {
        $genres = parent::getAll();
        return $genres->map(fn($genre) => GenreMapper::fromModel($genre))->toArray();
    }

    public function findById(int $id)
    {
        $genre = parent::findById($id);
        return GenreMapper::fromModel($genre);
    }

    public function createGenre(array $data)
    {
        $dto = new GenreDTO($data);
        $created = parent::create($dto);
        return GenreMapper::fromModel($created)->toArray();
    }

    public function updateGenre(int $id, array $data)
    {
        $dto = new GenreDTO($data);
        $updated = parent::update($id, $dto);
        return GenreMapper::fromModel($updated)->toArray();
    }
}

