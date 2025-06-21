<?php

namespace App\Jobs;

use App\Models\Subscription;
use App\Notifications\SubscriptionExpiredNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class UpdateSubscriptionExpiry implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $currentDate = now();
        $subscriptions = Subscription::where('end_date', '<=', $currentDate)
            ->where('status', 1)
            ->get();
            
        foreach ($subscriptions as $subscription) {
            if($subscription->end_date <= $currentDate) {
                $subscription->update(['status' => 0]);

                $user = $subscription->user;
                if ($user) {
                    Notification::send($user, new SubscriptionExpiredNotification($subscription));
                }
            }
        }

    }
}
