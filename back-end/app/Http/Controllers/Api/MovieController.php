<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileUploadService;
use App\Services\MovieService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MovieController extends BaseController
{
    protected $movieService;

    public function __construct(MovieService $movieService)
    {
        $this->movieService = $movieService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->movieService, 'title', $search, $perPage);
    }


    public function show(int $id)
    {
        return $this->handleShow($this->movieService, $id);
    }

    public function store(Request $request)
    {
        $data = [
            "title" => $request->title,
            "description" => $request->description ?? null,
            "thumbnail" => $request->thumbnail ?? null,
            "video_url" => $request->video_url ?? null,
            "release_year" => $request->release_year ?? null,
            "is_featured" => $request->is_featured ?? true,
            "genre_id" => $request->genre_id,
        ];

        try {
            $movie = $this->movieService->createMovie($data);
            return $this->createdResponse($movie, 'Movie created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(['id' => $id], $request->all());
        try {
            $movie = $this->movieService->updateMovie($id, $data);
            return $this->okResponse($movie, 'Movie updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->movieService, $id, 'Movie');
    }
}
