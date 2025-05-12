<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Services\GenreService;
use Illuminate\Validation\ValidationException;

class GenreController extends BaseController
{
    protected $genreService;

    public function __construct(GenreService $genreService)
    {
        $this->genreService = $genreService;
    }

    public function index(Request $request)
    {
        $serach = $request->search;
        return $this->handleIndex($this->genreService, 'name', $serach);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->genreService, $id);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        try {
            $genre = $this->genreService->createGenre($data);
            return $this->createdResponse($genre, 'Genre created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = $request->all();
        try {
            $genre = $this->genreService->updateGenre($id, $data);
            return $this->okResponse($genre, 'Genre updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->genreService, $id, 'Genre');
    }
}
