<?php

namespace App\Http\Controllers\Api;

use App\Services\RatingService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RatingController extends BaseController
{
    protected $ratingService;

    public function __construct(RatingService $ratingService)
    {
        $this->ratingService = $ratingService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->ratingService, $perPage);
    }


    public function show(int $id)
    {
        return $this->handleShow($this->ratingService, $id);
    }

    public function store(Request $request)
    {
        $data = [
            "user_id" => $request->user_id,
            "movie_id" => $request->movie_id,
            "rating" => $request->rating,
            "comment" => $request->comment,
        ];

        try {
            $rating = $this->ratingService->createRating($data);
            return $this->createdResponse($rating, 'Rating created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(['id' => $id], $request->all());
        try {
            $rating = $this->ratingService->updateRating($id, $data);
            return $this->okResponse($rating, 'Rating updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->ratingService, $id, 'Rating');
    }
}
