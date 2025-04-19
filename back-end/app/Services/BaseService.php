<?php
    namespace App\Services;

use App\DTOs\BaseDTO;
use App\Exceptions\CreationFailedException;
use App\Exceptions\DeletionFailedException;
use App\Exceptions\UpdateFailedException;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

abstract class BaseService{

    protected $repository;

    function getAll() {
        try {
            return $this->repository->getAll();
        } catch (\Exception $e) {
            throw new Exception('Failed to retrieve resources: ' . $e->getMessage());
        }
    }

    function findById(int $id) {
        try {
            return $this->repository->findById($id);
        } catch (ModelNotFoundException $e) {
            throw new ResourceNotFoundException('Resource not found with ID: ' . $id);
        } catch (\Exception $e) {
            throw new Exception('Failed to find resource: ' . $e->getMessage());
        }
    }

    function create(BaseDTO $dto) {
        try {
            return $this->repository->createOrUpdate($dto->toArray());
        } catch (\Exception $e) {
            throw new CreationFailedException('Failed to create resource: ' . $e->getMessage());
        }
    }

    function update(int $id, BaseDTO $dto) {
        try {
            $data = $dto->toArray();
            $data['id'] = $id;
            return $this->repository->createOrUpdate($data);
        } catch (ModelNotFoundException $e) {
            throw new ResourceNotFoundException('Resource not found with ID: ' . $id);
        } catch (\Exception $e) {
            throw new UpdateFailedException('Failed to update resource: ' . $e->getMessage());
        }
    }

    function delete(int $id) {
        try {
            return $this->repository->delete($id);
        } catch (ModelNotFoundException $e) {
            throw new ResourceNotFoundException('Resource not found with ID: ' . $id);
        } catch (\Exception $e) {
            throw new DeletionFailedException('Failed to update resource: ' . $e->getMessage());
        }
    }

}