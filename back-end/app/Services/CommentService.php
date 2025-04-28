<?php

namespace App\Services;

use App\Mapper\CommentMapper;
use App\Repositories\CommentRepository;
use CommentDTO;

class CommentService extends BaseService
{
    public function __construct(CommentRepository $commentRpository)
    {
        $this->repository = $commentRpository;
    }

    public function getAll(?string $key = null, ?string $search = null, int $perPage = 10)
    {
        $comments = parent::getAll($key, $search, $perPage);
        return $comments->map(fn($comment) => CommentMapper::fromModel($comment));
    }

    public function findById($id)
    {
        $comment = parent::findById($id);
        return CommentMapper::fromModel($comment);
    }

    public function createcomment(array $data)
    {
        $dto = new CommentDTO($data, true);
        $created = parent::create($dto);
        return CommentMapper::fromModel($created);
    }

    public function updatecomment(int $id, array $data)
    {
        $dto = new CommentDTO($data, true);
        $updated = parent::update($id, $dto);
        return CommentMapper::fromModel($updated);
    }
}
