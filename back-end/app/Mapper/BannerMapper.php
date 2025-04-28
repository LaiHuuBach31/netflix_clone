<?php
namespace App\Mapper;

use App\DTOs\BannerDTO;
use App\Models\Banner;

class BannerMapper extends BaseMapper{
    protected static string $dto = BannerDTO::class;
    protected static string $class = Banner::class;
}