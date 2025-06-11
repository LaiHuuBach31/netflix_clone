<?php
namespace App\Mapper;

use App\Models\Episodes;
use EpisodesDTO;

class EpisodesMapper extends BaseMapper{
    protected static string $dto = EpisodesDTO::class;
    protected static string $class = Episodes::class;
}