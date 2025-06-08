<?php

namespace App\Services;

use App\DTOs\FavouriteDTO;
use App\Exceptions\CreationFailedException;
use App\Mapper\FavouriteMapper;
use App\Repositories\FavouriteRepository;

class FavouriteService extends BaseService
{
    public function __construct(FavouriteRepository $favouriteRepository)
    {
        $this->repository = $favouriteRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $favourites = parent::getAll($key, $search, $perPage);
        $favourites->getCollection()->transform(fn($favourite) => FavouriteMapper::fromModel($favourite));
        return $favourites;
    }

    public function findById($id)
    {
        $favourite = parent::findById($id);
        return FavouriteMapper::fromModel($favourite);
    }

    public function createFavourite(array $data)
    {
        $dto = new FavouriteDTO($data, true);
        $userId = $dto->user_id;
        $movieId = $dto->movie_id;

        $existingFavourite = $this->repository->checkFavourite($userId, $movieId);

        if ($existingFavourite) {
            throw new CreationFailedException();
        }

        $created = parent::create($dto);
        return FavouriteMapper::fromModel($created);
    }

    public function updateFavourite(int $id, array $data)
    {
        $dto = new FavouriteDTO($data, true);
        $userId = $dto->user_id;
        $movieId = $dto->movie_id;

        $existingFavourite = $this->repository->checkFavourite($userId, $movieId);

        if ($existingFavourite && $existingFavourite->id != $id) {
            throw new CreationFailedException();
        }

        $updated = parent::update($id, $dto);
        return FavouriteMapper::fromModel($updated);
    }
}
