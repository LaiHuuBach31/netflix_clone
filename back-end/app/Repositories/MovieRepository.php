<?php
namespace App\Repositories;

use App\Models\Movie;

class MovieRepository extends BaseRepository{

    public function __construct(Movie $movie) {
        parent::__construct($movie);
    }

    public function createOrUpdate(array $data): Movie
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'title' => $data['title'],
                'description' => $data['description'],
                'thumbnail' => $data['thumbnail'],
                'video_url' => $data['video_url'],
                'release_year' => $data['release_year'],
                'is_featured' => $data['is_featured'],
            ]
        );
    }

}