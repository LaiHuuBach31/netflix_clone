<?php 

namespace App\Services;

use App\Mapper\EpisodesMapper;
use App\Repositories\EpisodesRepository;
use EpisodesDTO;

class EpisodesService extends BaseService
{
    public function __construct(EpisodesRepository $episodesRepository)
    {
        $this->repository = $episodesRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $Episodess = parent::getAll($key, $search, $perPage);
        $Episodess->getCollection()->transform(fn($episodes) => EpisodesMapper::fromModel($episodes));
        return $Episodess;
    }

    public function findById(int $id)
    {
        $episodes = parent::findById($id);
        return EpisodesMapper::fromModel($episodes);
    }

    public function createEpisodes(array $data)
    {
        $dto = new EpisodesDTO($data, true);
        $created = parent::create($dto);
        return EpisodesMapper::fromModel($created);
    }

    public function updateEpisodes(int $id, array $data)
    {
        $dto = new EpisodesDTO($data, true);
        $updated = parent::update($id, $dto);
        return EpisodesMapper::fromModel($updated);
    }
}