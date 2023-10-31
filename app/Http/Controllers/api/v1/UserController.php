<?php

namespace App\Http\Controllers\api\v1;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\TextModel; // Ensure you create a corresponding Eloquent model for texts.
use App\Models\User;

class UserController extends BaseController
{
    
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
        $user = User::where('email',$credentials['email'])->first();
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

            return response()->json([
                    "success" => true,
                    "message" => $responseMessage,
                    "data" => auth()->user(),
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
}

