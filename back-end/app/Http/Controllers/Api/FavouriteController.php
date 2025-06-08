<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\CreationFailedException;
use App\Services\FavouriteService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FavouriteController extends BaseController
{
    protected $favouriteService;

    public function __construct(FavouriteService $favouriteService)
    {
        $this->favouriteService = $favouriteService;    
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->favouriteService);
    }


    public function show(int $id)
    {
        return $this->handleShow($this->favouriteService, $id);
    }

    public function store(Request $request)
    {
        $data = [
            "user_id" => $request->user_id,
            "movie_id" => $request->movie_id,
        ];

        try {
            $favourite = $this->favouriteService->createFavourite($data);
            return $this->createdResponse($favourite, 'Favourite created successfully');
        }
         catch (ValidationException $e) {
            return $this->handleValidationException($e);
        } 
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(['id' => $id], $request->all());
        try {
            $favourite = $this->favouriteService->updateFavourite($id, $data);
            return $this->okResponse($favourite, 'Favourite updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->favouriteService, $id, 'Favourite');
    }
}
