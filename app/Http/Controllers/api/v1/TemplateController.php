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
        // $templates = Template::limit(120)->get();//->makeHidden('data');
        // $responseMessage = "Templates Loaded!";

        // return response()->json([
        //     'success' => true,
        //     'message' => $responseMessage,
        //     "templates" => $templates
        // ], 200);
        $pageNum = $request->get("current", 1);
        $pageSize = $request->get("pageSize", 10);
        $search = $request->get("search", "");
        $data = Template::whereNot("id", null);
        if($search != "") {
            $data = $data->where("name","like", "%$search%");
        }
        $total = $data->count();
        $data = $data->skip(($pageNum - 1) * $pageSize)->limit($pageSize)->get();
        return response()->json([
            "success" => true,
            "data" => $data,
            "total" => $total
            ],200);
    }
}
