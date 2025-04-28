<?php
namespace App\Services;

use App\DTOs\PlanDTO;
use App\Mapper\PlanMapper;
use App\Repositories\PlanRepository;

class PlanService extends BaseService {

    public function __construct(PlanRepository $genreRepository)
    {
        $this->repository = $genreRepository;
    }

    public function getAll()
    {
        $genres = parent::getAll();
        return $genres->map(fn($genre) => PlanMapper::fromModel($genre));

    }

    public function findById(int $id)
    {
        $genre = parent::findById($id);
        return PlanMapper::fromModel($genre);
    }

    public function createPlan(array $data)
    {
        $dto = new PlanDTO($data, true);
        $created = parent::create($dto);
        return PlanMapper::fromModel($created);
    }

    public function updatePlan(int $id, array $data)
    {
        $dto = new PlanDTO($data, true);
        $updated = parent::update($id, $dto);
        return PlanMapper::fromModel($updated);
    }

}