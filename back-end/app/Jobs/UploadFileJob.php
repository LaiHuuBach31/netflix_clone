<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\UploadedFile;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class UploadFileJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $file;
    protected $path;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(UploadedFile $file, string $path)
    {
        $this->file = $file;
        $this->path = $path;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    // public function handle()
    // {
    //     if ($this->file->isValid()) {
    //         $fileName = time() . '_' . $this->file->getClientOriginalName();
    //         Storage::disk('public')->putFileAs($this->path, $this->file, $fileName);
    //         // logic
    //         $this->info("File {$fileName} uploaded successfully to {$this->path}");
    //     } else {
    //         $this->fail(new \Exception('Invalid file upload'));
    //     }
    // }
}
