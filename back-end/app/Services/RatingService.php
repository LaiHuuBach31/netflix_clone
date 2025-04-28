<?php

namespace App\Services;

use App\DTOs\RatingDTO;
use App\Mapper\RatingMapper;
use App\Repositories\RatingRepository;

class RatingService extends BaseService
{
    public function __construct(RatingRepository $ratingRepository)
    {
        $this->repository = $ratingRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $ratings = parent::getAll($key, $search, $perPage);
        $ratings->getCollection()->transform(fn($rating) => RatingMapper::fromModel($rating));
        return $ratings;
    }

    public function findById($id)
    {
        $rating = parent::findById($id);
        return RatingMapper::fromModel($rating);
    }

    public function createRating(array $data)
    {
        $dto = new RatingDTO($data, true);
        $created = parent::create($dto);
        return RatingMapper::fromModel($created);
    }

    public function updateRating(int $id, array $data)
    {
        $dto = new RatingDTO($data, true);
        $updated = parent::update($id, $dto);
        return RatingMapper::fromModel($updated);
    }
}
