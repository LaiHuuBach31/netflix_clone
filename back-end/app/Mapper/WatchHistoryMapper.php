<?php 
namespace App\Mapper;

use App\DTOs\WatchHistoryDTO;
use App\Models\WatchHistory;

class WatchHistoryMapper extends BaseMapper{
    protected static string $dto = WatchHistoryDTO::class;
    protected static string $class = WatchHistory::class;
}