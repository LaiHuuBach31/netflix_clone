<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favourite extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'user_id', 'movie_id'];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

     public function movie() {
        return $this->belongsTo(Movie::class, 'movie_id', 'id');
    }
}
