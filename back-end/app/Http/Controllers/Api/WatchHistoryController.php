<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WatchHistoryService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class WatchHistoryController extends BaseController
{
    protected $watchHistoryService;

    public function __construct(WatchHistoryService $watchHistoryService)
    {
        $this->watchHistoryService = $watchHistoryService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->watchHistoryService, 'name', $search, $perPage);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->watchHistoryService, $id);
    }

    public function store(Request $request)
    {
        $data = [
            "user_id" => $request->user_id,
            "movie_id" => $request->movie_id ,
            "watched_at" => $request->start_date ?? now()->toDateTimeString(),
            "progress" => $request->progress ?? 0,
        ];

        try {
            $watchHistory = $this->watchHistoryService->createwatchHistory($data);
            return $this->createdResponse($watchHistory, 'WatchHistory created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(['id' => $id], $request->all());
        try {
            $watchHistory = $this->watchHistoryService->updatewatchHistory($id, $data);
            return $this->okResponse($watchHistory, 'WatchHistory updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->watchHistoryService, $id, 'WatchHistory');
    }

}
