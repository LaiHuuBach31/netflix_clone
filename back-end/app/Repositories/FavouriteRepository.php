<?php
namespace App\Repositories;

use App\Models\Favourite;

class FavouriteRepository extends BaseRepository{

    public function __construct(Favourite $favourite) {
        parent::__construct($favourite);
    }

    public function createOrUpdate(array $data): Favourite
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'user_id' => $data['user_id'],
                'movie_id' => $data['movie_id'],
            ]
        );
    }
}