<?php
    namespace App\Services;

use App\DTOs\BaseDTO;
use App\Exceptions\CreationFailedException;
use App\Exceptions\DeletionFailedException;
use App\Exceptions\UpdateFailedException;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

abstract class BaseService
{
    protected $repository;

    function getAll(?string $key = null ,?string $search = null, int $perPage = 10) {
        try {
            return $this->repository->getAll($key, $search, $perPage);
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
        DB::beginTransaction();
        try {
            $result = $this->repository->createOrUpdate($dto->toArray());
            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new CreationFailedException('Failed to create resource: ' . $e->getMessage());
        }
    }

    function update(int $id, BaseDTO $dto) {
        DB::beginTransaction();
        try {
            $data = $dto->toArray();
            $data['id'] = $id;
            $result = $this->repository->createOrUpdate($data);
            DB::commit();
            return $result;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw new ResourceNotFoundException('Resource not found with ID: ' . $id);
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UpdateFailedException('Failed to update resource: ' . $e->getMessage());
        }
    }

    function delete(int $id) {
        DB::beginTransaction();
        try {
            $result = $this->repository->delete($id);
            DB::commit();
            return $result;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            throw new ResourceNotFoundException('Resource not found with ID: ' . $id);
        } catch (\Exception $e) {
            DB::rollBack();
            throw new DeletionFailedException('Failed to delete resource: ' . $e->getMessage());
        }
    }
}
