<?php

namespace App\Http\Controllers\api\v1\admin;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Plan;

class UserController extends BaseController
{
    public function getUsers(Request $request) {
        $pageNum = $request->get("current", 1);
        $pageSize = $request->get("pageSize", 10);
        $search = $request->get("search", "");
        $data = User::whereNot("id", null)->with("designs");
        if($search != "") {
            $data = $data->where("name","like", "%$search%")->orWhere("email","like", "%$search%");
        }
        $total = $data->count();
        $data = $data->skip(($pageNum - 1) * $pageSize)->limit($pageSize)->get();
        return response()->json([
            "success" => true,
            "data" => $data,
            "total" => $total
            ],200);
    }

    public function getUser($id) {
        $user = User::where("id", $id)->first();
        $user['active'] = false;
        $user['cancelled'] = false;
        $user['ended'] = false;
        $user['ends_at'] = null;
        $user['plan'] = null;
        $plan = null;
        $subscriptionPlan = $user->subscription('default');
        if ($subscriptionPlan != null) {
            $user['active'] = $subscriptionPlan->active();
            $user['cancelled'] = $subscriptionPlan->canceled();
            $user['ended'] = $subscriptionPlan->ended();
            $user['ends_at'] = $subscriptionPlan->ends_at;
            $user['plan'] = Plan::where('stripe_plan', $subscriptionPlan->stripe_price)->first();
        }
        unset($user['subscriptions']);
        return $user;
    }
}

