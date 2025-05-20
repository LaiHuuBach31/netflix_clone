<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{   

    public function storeFile(UploadedFile $file, string $directory): string
    {
        try {
            
            $fullPath = storage_path("app/public/{$directory}");
            if (!file_exists($fullPath)) {
                mkdir($fullPath, 0755, true);
            }

            $fileName = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());

            $path = $file->storeAs($directory, $fileName, 'public');

            return Storage::url($path);
        } catch (\Exception $e) {
            throw new \Exception('Failed to store file: ' . $e->getMessage());
        }
    }

    public function deleteFile(string $filePath): bool
    {
        try {
            $relativePath = str_replace(Storage::url(''), '', $filePath);
            if (Storage::disk('public')->exists($relativePath)) {
                $deleted = Storage::disk('public')->delete($relativePath);
                return $deleted;
            }
            return false;
        } catch (\Exception $e) {
            return false;
        }
    }
    
}
