<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BannerService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BannerController extends BaseController
{
    protected $bannerService;

    public function __construct(BannerService $bannerService)
    {
        $this->bannerService = $bannerService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->bannerService, 'title', $search, $perPage);
    }

    public function show(int $id)
    {
        return $this->handleShow($this->bannerService, $id);
    }
    
    public function store(Request $request)
    {
        $data = $request->all();
        try {
            $banner = $this->bannerService->createBanner($data);
            return $this->createdResponse($banner, 'Banner created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = $request->all();
        try {
            $banner = $this->bannerService->updateBanner($id, $data);
            return $this->okResponse($banner, 'Banner updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        return $this->handleDelete($this->bannerService, $id, 'Banner');
    }
}
