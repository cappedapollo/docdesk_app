<?php

namespace App\Http\Controllers\api\v1;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Template;

class TemplateController extends BaseController
{
    //
    public function getAll(Request $request)
    {
        $template = Template::limit(120)->get();
        return response()->json($template);
    }

    public function getTemplateList(Request $request){
        $templates = Template::limit(120)->get();//->makeHidden('data');
        $responseMessage = "Templates Loaded!";

        return response()->json([
            'success' => true,
            'message' => $responseMessage,
            "templates" => $templates
        ], 200);
    }
}
