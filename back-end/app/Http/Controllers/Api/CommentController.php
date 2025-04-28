<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Services\CommentService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CommentController extends BaseController
{
    protected $commentService;

    public function __construct(CommentService $commentService) {
        $this->commentService = $commentService;
    }   

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->commentService, 'content', $search, $perPage);
    }

    public function show(int $id) {
        return $this->handleShow($this->commentService, $id);
    }

    public function store(Request $request) {
        
        $data = [
            "user_id" => $request->user_id,
            "movie_id" => $request->movie_id,
            "content" => $request->content,
            "parent_id" => $request->parent_id ?? 0,
        ];
        
        try {
            $comment = $this->commentService->createcomment($data);
            return $this->createdResponse($comment, 'Comment created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(['id' => $id], $request->all());

        try {
            $comment = $this->commentService->updateComment($id, $data);
            return $this->okResponse($comment, 'Comment updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        $this->deleteRecursive($id);
        return $this->handleDelete($this->commentService, $id, 'Comment');
    }

    private function deleteRecursive(int $id){

        $children = Comment::where('parent_id', $id)->get();

        foreach ($children as $key => $child) {
            $this->deleteRecursive($child->id);
            $child->delete();
        }

    }
}
