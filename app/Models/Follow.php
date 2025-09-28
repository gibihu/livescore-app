<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $table = 'follows';

    protected $primaryKey = 'id';

    protected $fillable = [
        'follower_id',
        'followed_id',
    ];

    public $timestamps = true;
    // ผู้กดติดตาม, ผู้ถูกติดตาม
    // Followers, Followed


    // ผู้กดติดตาม
    public function follower()
    {
        return $this->belongsTo(User::class, 'follower_id', 'id');
    }

    // ผู้ถูกติดตาม
    public function followed()
    {
        return $this->belongsTo(User::class, 'followed_id', 'id');
    }
}
