<?php
namespace App\Http\Controllers\api\v1;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Design;

class DesignController extends BaseController
{

    public function saveDesign(Request $request){
        if($request->file('file') != null){
            $thumbnail_path = $request->file('file')->store('public/thumbnail');
            $thumbnail_path = str_replace('public',"/storage",$thumbnail_path);
        }
        else{
            $thumbnail_path = "";
        }
        
        try{
            if($request->id == -1){
                $design = new Design(['name'=>$request->designName, 'data' =>$request->data,'thumbnail' =>$thumbnail_path]);
                auth()->user()->designs()->save($design);    
            }
            else{
                $design = Design::findorFail($request->id);
                $design->name = $request->designName;
                $design->thumbnail = $thumbnail_path;
                $design->data = $request->data;
                $design->save();
            }    
            $responseMessage = "Saved Design!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Saving Design!";
        }
        
        return response()->json([
            'success' => true,
            'design_id' => $design->id,
            'message' => $responseMessage
        ], 200);
    }

    public function renameDesign(Request $request){

        try{
            $design = Design::findorFail($request->id);
            $design->name = $request->designName;
            $design->save();
            $responseMessage = "Changed Design Name!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Changing Design!";
        }
        
        return response()->json([
            'success' => true,
            'message' => $responseMessage
        ], 200);
    }

    public function deleteDesign(Request $request){

        try{
            $design = Design::findorFail($request->id);
            $design->delete();
            $responseMessage = "Deleted Design!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Changing Design!";
        }
        
        return response()->json([
            'success' => true,
            'design_id' => $design->id,
            'message' => $responseMessage
        ], 200);
    }

    public function duplicateDesign(Request $request){

        try{
            $design = Design::findorFail($request->id);
            $duplicatedPost = $design->replicate();
            $duplicatedPost->save();
            $responseMessage = "Duplicated Design Name!";
        }
        catch(Exception $e){
            $responseMessage = "Failed Duplicating Design!";
        }
        
        return response()->json([
            'success' => true,
            'message' => $responseMessage
        ], 200);
    }

    

    public function listDesigns(Request $request){
        $designs =  auth()->user()->designs()->get();
        $responseMessage = "Loaded Designs!";
        return response()->json([
            'success'=>true, 
            'message'=>$responseMessage,
            'designs'=>$designs
        ],200);
    }
}