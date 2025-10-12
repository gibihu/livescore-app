<?php

namespace App\Models\Posts;

use App\Helpers\RankHelper;
use App\Models\Users\User;
use App\Traits\UserRankTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
        'level_text',
        'level_json'
    ];


    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->select('id', 'name', 'username', 'tier');
    }
    public function season()
    {
        return $this->belongsTo(Season::class, 'season_id', 'id');
    }

    protected function levelText(): Attribute
    {
        return Attribute::get(function () {
            $helperList = RankHelper::list(false);
            $level = $this->level;

            $item = collect($helperList)->firstWhere('id', $level);
            return $item['name'] ?? 'Unknown';
        });
    }

    protected function levelJson(): Attribute
    {
        return Attribute::get(function () {
            $helperList = RankHelper::list(false);
            $level = $this->level;

            $item = collect($helperList)->firstWhere('id', $level);
            return $item ?? [];
        });
    }
}
