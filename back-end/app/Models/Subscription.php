<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'user_id', 'plan_id', 'start_date', 'end_date', 'status'];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function plan() {
        return $this->belongsTo(Plan::class, 'plan_id', 'id');
    }

}
