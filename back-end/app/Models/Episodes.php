<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Episodes extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'title', 'episode_number', 'thumbnail', 'video_url', 'duration', 'movie_id'];

    public function movie()
    {
        return $this->belongsTo(Movie::class, 'movie_id', 'id');
    }

}
