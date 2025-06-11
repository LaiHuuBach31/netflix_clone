<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EpisodesService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EpisodesController extends BaseController
{
    protected $episodesService;

    public function __construct(EpisodesService $episodesService)
    {
        $this->episodesService = $episodesService;
    }

    public function index(Request $request)
    {
        $search = $request->search;
        return $this->handleIndex($this->episodesService, 'title', $search);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->episodesService, $id);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        try {
            $Episodes = $this->episodesService->createEpisodes($data);
            return $this->createdResponse($Episodes, 'Episodes created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(['id' => $id], $request->all());
        try {
            $episodes = $this->episodesService->updateEpisodes($id, $data);
            return $this->okResponse($episodes, 'Episodes updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->episodesService, $id, 'Episodes');
    }
}
