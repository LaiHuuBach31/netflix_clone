<?php
namespace App\Repositories;

use App\Models\WatchHistory;

class WatchHistoryRepository extends BaseRepository{

    public function __construct(WatchHistory $watchHistory)
    {
        parent::__construct($watchHistory);
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $query = $this->model->newQuery();

        if ($key && $search) {
            $query->where($key, 'like', '%' . $search . '%');
        }

        $query->with('user', 'movie');
        
        return $query->paginate($perPage);
    }

    public function createOrUpdate(array $data): WatchHistory
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'user_id' => $data['user_id'],
                'movie_id' => $data['movie_id'],
                'watched_at' => $data['watched_at'],
                'progress' => $data['progress'],
            ]
        );
    }
}