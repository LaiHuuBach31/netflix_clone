<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GenreService;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GenreController extends Controller
{
    use ApiResponses;

    protected $genreService;

    public function __construct(GenreService $genreService)
    {
        $this->genreService = $genreService;
    }

    public function index()
    {
        $genres = $this->genreService->getAll();
        return $this->okResponse($genres,'Genres fetched successfully');
    }

    public function show(int $id)
    {
        $genre = $this->genreService->findById($id);
        return $this->okResponse($genre,'Find genres successfully');
    }

    public function store(Request $request)
    {
        $data = $request->all();
        try {
            $genre = $this->genreService->createGenre($data);
            return $this->createdResponse($genre, 'Genre created successfully');
        } catch (ValidationException $e) {
            return $this->unprocessableResponse($e->errors(), 'Validation failed');
        }
    }

    public function update(Request $request, int $id) {
        try {
            $data = $request->all();
            $genre = $this->genreService->updateGenre($id, $data);
            return $this->okResponse($genre, 'Genre updated successfully');
        } catch (ValidationException $e) {
            return $this->unprocessableResponse($e->errors(), 'Validation failed');
        }
    }

    public function destroy(int $id)
    {
        $this->genreService->delete($id);   
        return $this->okResponse(['mesage' => 'Genre deleted successfully']);
    }
}
