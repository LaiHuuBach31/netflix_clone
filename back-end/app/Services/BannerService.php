<?php

namespace App\Services;

use App\DTOs\BannerDTO;
use App\Mapper\BannerMapper;
use App\Repositories\BannerRepository;

class BannerService extends BaseService
{
    public function __construct(BannerRepository $bannerRepository)
    {
        $this->repository = $bannerRepository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $banners = parent::getAll($key, $search, $perPage);
        $banners->getCollection()->transform(fn($banner) => BannerMapper::fromModel($banner));
        return $banners;
    }

    public function findById(int $id)
    {
        $banner = parent::findById($id);
        return BannerMapper::fromModel($banner);
    }

    public function createBanner(array $data)
    {
        $dto = new BannerDTO($data, true);
        $created = parent::create($dto);
        return BannerMapper::fromModel($created);
    }

    public function updateBanner(int $id, array $data)
    {
        $dto = new BannerDTO($data, true);
        $updated = parent::update($id, $dto);
        return BannerMapper::fromModel($updated);
    }
}
