<?php
namespace App\Repositories;

use App\Models\Rating;

class RatingRepository extends BaseRepository{

    public function __construct(Rating $rating) {
        parent::__construct($rating);
    }

    public function createOrUpdate(array $data): Rating
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'user_id' => $data['user_id'],
                'movie_id' => $data['movie_id'],
                'rating' => $data['rating'],
                'comment' => $data['comment'],
            ]
        );
    }

}