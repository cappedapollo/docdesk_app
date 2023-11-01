<?php

// app/Http/Controllers/PlanController.php

namespace App\Http\Controllers\api\v1;

use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use App\Models\Plan; // Ensure a corresponding Eloquent model for plans is created.
use Illuminate\Routing\Controller as BaseController;
use Stripe;

class PlanController extends BaseController
{
    public function getPlans(Request $request)
    {
        $user = Auth::user();
		$subscriptionPlan = $user->subscription('default');
		// echo "<pre>";
		$cancelled = false;
		if ($subscriptionPlan != null) {
			$cancelled = $subscriptionPlan->canceled();
			// print_r($subscriptionPlan);
		}
		
		// echo "</pre>";

		$dbplans = Plan::getPlans();
		$plans = [];
		
		foreach ($dbplans as $plan) {
			// echo "<pre>";
			// echo $user->subscribedToPrice($plan, 'default');
			// print_r($user->subscription($plan->name));
			// echo "</pre>";

			$ends_at = $subscriptionPlan && $subscriptionPlan->stripe_price == $plan->stripe_plan ? $subscriptionPlan->ends_at : null;
			$cancelled = $subscriptionPlan && $subscriptionPlan->stripe_price == $plan->stripe_plan ? $subscriptionPlan->canceled() : false;
			$ended = false;
			if ($subscriptionPlan) {
				$ended = $cancelled ? $subscriptionPlan->ended() : $subscriptionPlan->pastDue();
			}

			$plans[] = array(
				// 'subscribed' => $user->subscribedToPrice($plan, 'default'),
				'subscribed' => $user->subscribedToPrice($plan, 'default'),
				'title' => $plan->name,
				'stripe_plan'=>$plan->stripe_plan,
				'cost'=>$plan->cost,
				'ends_at' => $ends_at,
				'cancelled'=> $cancelled,
				'ended' => $ended
			);
		}
        return response()->json($plans);
    }

    public function getcustomer(Request $request)
	{
		$user = Auth::user();

		// $cancelled = false;
		// $subscriptionPlan = $user->subscription('default');
		// if ($subscriptionPlan != null) {
		// 	$cancelled = $subscriptionPlan->canceled();
		// }

		// if(! $user->subscribed('default')) {
		if(! $user->subscribed('default')) {
			// $options = [
			// 	'email' => $user->email
			// ];
			// $user->createOrGetStripeCustomer($options);
			$user->createOrGetStripeCustomer();
		}

		$intent = $user->createSetupIntent();
		return $intent->client_secret;
	}

    public function subscribe(Request $request)
	{
		Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
		$stripeToken = $request->tokenInput;
		$plan_name = $request->plan;
		$plan = Plan::where('slug', $plan_name)->first();
		if(!$plan){
			return "no-plan";
		}
		$plan = $plan->stripe_plan;
		$user = Auth::user();
        
		// $user->subscription('default')->canceled();
		// if($user->subscribedToPrice($plan, 'default')) {
		$cancelled = false;
		$subscriptionPlan = $user->subscription('default');
		if ($subscriptionPlan != null) {
			$cancelled = $subscriptionPlan->canceled();
		}

		// echo "<pre>";
		// echo $user->subscribed('default');
		// echo $cancelled;
		// echo $user->subscribedToPrice($plan, 'default');
		// echo "</pre>";

		// if($user->subscribedToPrice($plan, 'default')) {
		if($user->subscribedToPrice($plan, 'default') && !$cancelled) {
			return "failed";
		}

		$user->addPaymentMethod($stripeToken);
		$user->newSubscription('default', $plan)->create($stripeToken, [
						'email' => $user->email
		]);
		$user->cancelled = 0;
		$user->save();
		return "success";
	}

    public function changePlan(Request $request, $plan)
	{
		$user = Auth::user();
		$type = $request->input('type');
		$plan = Plan::where('slug', $plan)->first();
		$plan = $plan->stripe_plan;
		$user->subscription('default')->swapAndInvoice($plan);
		$user->cancelled = 0;
		$user->cancelled_plan_name = null;
		$user->save();
		return "success";
	}

    public function removecustomer(Request $request)
	{
		$user = Auth::user();
		$result = $user->asStripeCustomer();
		$result->delete();
		$user->stripe_id = null;
		$user->save();
		echo json_encode($result);
	}

	public function cancel(Request $request)
	{
		$user = Auth::user();

		$subscriptionPlan = $user->subscription('default');

		$stripe_plan = $subscriptionPlan->stripe_price;
		$subscriptionPlan->cancel();
// 		$result = $user->asStripeCustomer();
// 		$result->delete();
		
		// $user->stripe_id = '';
		$user->cancelled_plan_name = $stripe_plan;
		$user->cancelled = 1;
		$user->save();
		return "success";
	}

	public function restorePlan(Request $request)
	{
		$user = Auth::user();
		$subscriptionPlan = $user->subscription('default');
		$subscriptionPlan->resume();
		$user->cancelled = 0;
		$user->cancelled_plan_name = null;
		$user->save();
		return "success";
	}

}

