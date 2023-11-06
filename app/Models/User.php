<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Cashier\Billable;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function toArray()
    {
        $plan = null;
        if($this->subscription('default') != null) {
            $plan = Plan::where("stripe_plan", $this->subscription('default')->stripe_price)->first();
        }
        // Customize the JSON response attributes here
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'active' => $this->active,
            "cancelled" => $this->cancelled,
            'ended' => $this->ended,
            'ends_at' => $this->ends_at,
            "plan" => $plan,
            'designs' => $this->designs,
            'lastLogin' => $this->tokens->last(),
            'createdAt' => $this->created_at
        ];
    }

    public function designs(): HasMany
    {
        return $this->hasMany(Design::class);
    }
}

