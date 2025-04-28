<?php

namespace App\Repositories;

use App\Models\Banner;

class BannerRepository extends BaseRepository
{

    public function __construct(Banner $banner)
    {
        parent::__construct($banner);
    }

    public function createOrUpdate(array $data): Banner
    {
        return $this->model->updateOrCreate(
            ['id' => $data['id'] ?? null],
            [
                'title' => $data['title'],
                'image' => $data['image'],
                'movie_id' => $data['movie_id'],
                'is_active' => $data['is_active'],
            ]
        );
    }
}
