<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileUploadService;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class FileUploadController extends Controller
{
    use ApiResponses;

    protected  $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }


    public function uploadImage(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $imageUrl = $this->fileUploadService->storeFile($request->file('file'), 'uploads/images');

            return $this->successResponse($imageUrl,'Image uploaded successfully');
        } catch (\Exception $e) {
            return $this->errorResponse([], 'Failed to upload image: ' . $e->getMessage());
        }
    }

    public function uploadVideo(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|mimes:mp4,mov,avi,mkv|max:102400',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $videoUrl = $this->fileUploadService->storeFile($request->file('file'), 'uploads/videos');

            return $this->successResponse(['url' => $videoUrl], 'Video uploaded successfully');

        } catch (\Exception $e) {
            return $this->errorResponse([], 'Failed to upload video: ' . $e->getMessage());
        }
    }
}
