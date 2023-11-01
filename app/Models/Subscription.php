<?php

namespace App\Models;
use DB;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    // protected $casts = [
    //     'content' => 'array'
    // ];

    static function getUserSubscribedPlan($user_id) {
		$sub = DB::table('subscriptions')
			->join('plans', 'subscriptions.stripe_price', '=', 'plans.stripe_plan')
			->select('plans.name', 'subscriptions.stripe_id', 'subscriptions.stripe_price', 'subscriptions.stripe_status', 'subscriptions.ends_at', 'subscriptions.created_at')
			->where('subscriptions.stripe_status','active')
            ->where('subscriptions.user_id', $user_id)
            ->orderBy('subscriptions.created_at', 'desc')
			->get();
		
		if(count($sub) > 0){
			return $sub[0];
		} else {
			return null;
		}
	}
}
