<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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

    protected static function boot()
    {
        parent::boot();

        // ก่อนบันทึก record ใหม่
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
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
    const TIRE_SILVER = 2;
    const TIRE_GOLD = 3;
    const TIRE_VIP = 4;
    public static $tierLabels = [
        self::TIER_BRONZE => 'bronze',
        self::TIRE_SILVER => 'silver',
        self::TIRE_GOLD => 'gold',
        self::TIRE_VIP => 'vip',
    ];
    public function getTierTextAttribute()
    {
        return self::$tierLabels[$this->tier] ?? 'unknown';
    }
}
