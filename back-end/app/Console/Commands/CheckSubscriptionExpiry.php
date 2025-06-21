<?php

namespace App\Console\Commands;

use App\Jobs\UpdateSubscriptionExpiry;
use Illuminate\Console\Command;

class CheckSubscriptionExpiry extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:subscription-expiry';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch a job to check and update expired subscriptions';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        dispatch(new UpdateSubscriptionExpiry());
        // UpdateSubscriptionExpiry::dispatch();

        $this->info('Job to update expired subscriptions has been dispatched successfully.');

        return Command::SUCCESS;
    }
}
