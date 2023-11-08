<?php

namespace App\Http\Controllers\api\v1;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\TextModel; // Ensure you create a corresponding Eloquent model for texts.
use App\Models\User;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ForgotPasswordMail;

class UserController extends BaseController
{
    public function getSubscriptionUser() {
        $user = auth()->user();
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

    public function signUp(Request $request){
        
        $validator = Validator::make($request->all(),[
            'name' => 'required|string',
            'email' => 'required|string|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);
        
        if($validator->fails()){
            $arrErrors = $validator->messages()->toArray();
            $message = "";
            foreach($arrErrors as $key => $value){
                $message = $message. $value[0]. "\n";
            }
            return response()->json([
                'success' => false,
                'message' => $message
            ], 200);
        }

        $data = [
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password)
        ];

        User::create($data);

        $responseMessage = "Registration Successful";

        return response()->json([
            'success' => true,
            'message' => $responseMessage
        ], 200);
    }

    public function signIn(Request $request){
        $validator = Validator::make($request->all(),[
            'email' => 'required|string',
            'password' => 'required|min:6',
        ]);

        if($validator->fails()){
            return response()->json([
                'success' => false,
                'message' => $validator->messages()->toArray()
            ], 200);
        }

        $credentials = $request->only(["email","password"]);

        $user = User::where('email', $credentials['email'])->first();

        if($user){
            if(!auth()->attempt($credentials)){
                $responseMessage = "Invalid username or password";
                
                return response()->json([
                    "success" => false,
                    "message" => $responseMessage,
                    "error" => $responseMessage
                ], 200);
            }
            
            $accessToken = auth()->user()->createToken('authToken')->plainTextToken;
            $responseMessage = "Login Successful";

            $user = $this->getSubscriptionUser();

            return response()->json([
                    "success" => true,
                    "message" => $responseMessage,
                    "user" => $user,
                    "token" => $accessToken
                    ],200);
        }
        else{
            $responseMessage = "Sorry, this user does not exist";
            return response()->json([
                "success" => false,
                "message" => $responseMessage,
                "error" => $responseMessage
            ], 422);
        }
    }

    public function signInWithToken(Request $request){

        $id = explode("|", $request->token)[0];
    
        $tokenRecord = DB::table('personal_access_tokens')->where("id", $id)->first();

        if($tokenRecord == null) {
            $responseMessage = "Sorry, can not find token";
            return response()->json([
                "success" => false,
                "message" => $responseMessage,
                "error" => $responseMessage
            ], 422);
        }

        $user = User::where("id", $tokenRecord->tokenable_id)->first();

        if($user){
            
            $accessToken = $user->createToken('authToken')->plainTextToken;
            $responseMessage = "Login Successful";
            $user = $this->getSubscriptionUser();

            return response()->json([
                    "success" => true,
                    "message" => $responseMessage,
                    "user" => $user,
                    "token" => $accessToken
                    ],200);
        }
        else{
            $responseMessage = "Sorry, this user does not exist";
            return response()->json([
                "success" => false,
                "message" => $responseMessage,
                "error" => $responseMessage
            ], 422);
        }
    }
    
    public function forgotPassword(Request $request) {
        // Mail::to("davidhandevdev@gmail.com")->send(new ForgotPasswordMail("234"));
        // return "";
        # Instantiate the client.
        $mgClient = Mailgun::create('b78f8f54d5dc69013313fcc7f1c4823d-8c9e82ec-38049def', 'https://localhost:8000');
        $domain = "davidhandevdev@gmailc.om";
        $params = array(
        'from'    => 'Excited User davidhandevdev@gmailc.om',
        'to'      => 'apollo0114@outlook.com',
        'subject' => 'Hello',
        'text'    => 'Testing some Mailgun awesomness!'
        );

        # Make the call to the client.
        $mgClient->messages()->send($domain, $params);

    }
}

