<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'title', 'image', 'movie_id', 'is_active'];

    public function movie() {
        return $this->belongsTo(Movie::class, 'movie_id', 'id');
    }

}
