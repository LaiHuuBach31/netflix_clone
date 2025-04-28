<?php
    namespace App\Repositories;

use App\Models\Genre;

class GenreRepository extends BaseRepository {

    public function __construct(Genre $genre) {
        parent::__construct($genre);
    }

    public function createOrUpdate(array $data): Genre
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            ['name' => $data['name']]
        );
    }

}