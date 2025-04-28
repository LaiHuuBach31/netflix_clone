<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GenreMovieService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GenreMovieController extends BaseController
{
    protected $genreMovieService;

    public function __construct(GenreMovieService $genreMovieService)
    {
        $this->genreMovieService = $genreMovieService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->genreMovieService);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->genreMovieService, $id);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        try {
            $genre = $this->genreMovieService->createGenreMovie($data);
            return $this->createdResponse($genre, 'GenreMovie created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = $request->all();
        try {
            $genre = $this->genreMovieService->updateGenreMovie($id, $data);
            return $this->okResponse($genre, 'GenreMovie updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->genreMovieService, $id, 'GenreMovie');
    }
}
