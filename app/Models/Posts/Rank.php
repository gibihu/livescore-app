<?php

namespace App\Models\Posts;

use App\Models\Users\User;
use App\Traits\UserRankTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Rank extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    use UserRankTrait;
    protected $table = 'user_ranks';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'user_id',
        'level',
        'score',
        'season_id',
        'type',
    ];
    protected $with = [
//        'user',
        'season',
    ];

    protected $appends = [
        'type_text',
    ];

    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->select('id', 'name', 'username', 'tier');
    }
    public function season()
    {
        return $this->belongsTo(season::class, 'season_id', 'id');
    }
}
