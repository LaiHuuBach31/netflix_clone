<?php
namespace App\Mapper;

use App\Models\Comment;
use CommentDTO;

class CommentMapper extends BaseMapper{
    protected static string $dto = CommentDTO::class;
    protected static string $class = Comment::class;
}