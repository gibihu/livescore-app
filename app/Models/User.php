<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Support\Str;;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'password',
        'tier',
        'exp',
        'role',
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
