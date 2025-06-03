<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'title', 'description', 'thumbnail', 'video_url', 'release_year', 'is_featured', 'genre_id'];

    public function genre() {
        return $this->belongsTo(Genre::class, 'genre_id', 'id');
    }
}
