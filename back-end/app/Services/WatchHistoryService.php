<?php
namespace App\Services;

use App\DTOs\WatchHistoryDTO;
use App\Mapper\WatchHistoryMapper;
use App\Repositories\WatchHistoryRepository;

class WatchHistoryService extends BaseService{

    public function __construct(WatchHistoryRepository $watchHistoryRepository)
    {
        $this->repository = $watchHistoryRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $watchHistorys = parent::getAll($key, $search, $perPage);
        $watchHistorys->getCollection()->transform(fn($watchHistory) => WatchHistoryMapper::fromModel($watchHistory));
        return $watchHistorys;
    }

    public function findById(int $id)
    {
        $genre = parent::findById($id);
        return WatchHistoryMapper::fromModel($genre);
    }

    public function createWatchHistory(array $data)
    {
        $dto = new WatchHistoryDTO($data, true);
        $created = parent::create($dto);
        return WatchHistoryMapper::fromModel($created);
    }

    public function updateWatchHistory(int $id, array $data)
    {
        $dto = new WatchHistoryDTO($data, true);
        $updated = parent::update($id, $dto);
        return WatchHistoryMapper::fromModel($updated);
    }
}