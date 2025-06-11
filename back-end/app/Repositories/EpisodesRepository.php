<?php

namespace App\Repositories;

use App\Models\Episodes;

class EpisodesRepository extends BaseRepository
{
    public function __construct(Episodes $episodes)
    {
        parent::__construct($episodes);
    }

    public function createOrUpdate(array $data): Episodes
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'title' => $data['title'],
                'episode_number' => $data['episode_number'],
                'thumbnail' => $data['thumbnail'] ?? null,
                'video_url' => $data['video_url'],
                'duration' => $data['duration'],
                'movie_id' => $data['movie_id'],
            ]
        );
    }
}