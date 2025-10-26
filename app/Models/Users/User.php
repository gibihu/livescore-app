<?php

namespace App\Models\Users;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Controllers\Users\SeasonController;
use App\Models\Posts\Rank;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

;

class User extends Authenticatable
{
    use HasUuids; // เพราะ id เป็น uuid
    use SoftDeletes;
    protected $table = 'users';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'username',
        'email',
        'avatar',
        'bio',
        'password',
        'tier',
        'exp',
        'role',
        'rank_id',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'id' => 'string',
    ];
    protected $appends = [
        'role_text',
        'tier_text',
    ];

    protected $with = [
        'rank',
        'bank_account',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // join transaction
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'user_id', 'id');
    }
    public function wallet()
    {
        return $this->hasOne(Wallet::class, 'user_id');
    }
    public function rank()
    {
        return $this->belongsTo(Rank::class, 'rank_id', 'id')
            ->withDefault([
                'name' => 'ไม่มีอันดับ',
                'level' => 0,
                'score' => 0,
                'type' => 0,
            ]);
    }
    public function bank_account()
    {
        return $this->hasOne(UserBankAccount::class, 'user_id', 'id');
    }

    public function getActiveRankAttribute()
    {
        // ถ้ามี rank_id อยู่แล้ว ใช้อันนี้เลย
        if ($this->rank_id && $this->rank) {
            return $this->rank;
        }

        // ถ้าไม่มี rank_id ให้ไปดึงจาก GetRank() (อย่าลืม Auth::user() ต้องเป็น user เดียวกัน)
        $rank = SeasonController::GetRank();
        $this->rank_id = $rank->id;
        $this->save();

        return $rank;
    }


    const ROLE_USER = 1;
    const ROLE_ADMIN = 2;
    public static $roleLabels = [
        self::ROLE_USER => 'user',
        self::ROLE_ADMIN => 'admin',
    ];
    public function getRoleTextAttribute()
    {
        return self::$roleLabels[$this->role] ?? 'unknown';
    }

    const TIER_BRONZE = 1;
    const TIER_SILVER = 2;
    const TIER_GOLD = 3;
    const TIER_VIP = 4;
    public static $tierLabels = [
        self::TIER_BRONZE => 'bronze',
        self::TIER_SILVER => 'silver',
        self::TIER_GOLD => 'gold',
        self::TIER_VIP => 'vip',
    ];
    public function getTierTextAttribute()
    {
        return self::$tierLabels[$this->tier] ?? 'unknown';
    }
}
