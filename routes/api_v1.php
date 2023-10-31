<?php

use App\Http\Controllers\api\v1\FontController;
use App\Http\Controllers\api\v1\TextController;
use App\Http\Controllers\api\v1\ImageController;
use App\Http\Controllers\api\v1\FrameController;
use App\Http\Controllers\api\v1\TemplateController;
use App\Http\Controllers\api\v1\UserController;
use App\Http\Controllers\api\v1\DesignController;

/*
|--------------------------------------------------------------------------
| API v1 Routes
|--------------------------------------------------------------------------
|
| This file contains all of the v1 routes.
| This file is loaded and the routes are pre-pended automatically 
| by App\Providers\RouteServiceProvider->boot()
|
*/

// Authenticated API (sanctum)
Route::group([
    'middleware' => ['api_authenticated']
], function() {
    
    Route::get('/texts', [TextController::class, 'getAll']);

    Route::get('/fonts', [FontController::class, 'getAll']);
    
    Route::get('/images', [ImageController::class, 'getAll']);
    
    Route::get('/frames', [FrameController::class, 'getAll']);
    
    Route::get('/templates', [TemplateController::class, 'getAll']);

    Route::get('/templates/list', [TemplateController::class, 'getTemplateList']);

    Route::prefix('design')->group(function () {

        Route::post('/save', [DesignController::class, 'saveDesign']);
        Route::post('/rename', [DesignController::class, 'renameDesign']);
        Route::post('/delete', [DesignController::class, 'deleteDesign']);
        Route::post('/duplicate', [DesignController::class, 'duplicateDesign']);
        
        Route::get('/list', [DesignController::class, 'listDesigns']);
        
    });
    
    

});

// Public API
Route::group([
    'middleware' => ['api_public'],
], function () {

    Route::post('/auth/signup', [UserController::class, 'signUp']);

    Route::post('/auth/signin', [UserController::class, 'signIn']);
});
