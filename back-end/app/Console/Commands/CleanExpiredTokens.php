<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanExpiredTokens extends Command
{
    protected $signature = 'tokens:clean-expired';
    protected $description = 'Clean expired refresh tokens from the database';

    public function handle()
    {
        $deleted = DB::table('refresh_tokens')
              ->where('expires_at', '<', now())
              ->delete();

          $this->info("Deleted {$deleted} expired refresh tokens.");
    }
}
