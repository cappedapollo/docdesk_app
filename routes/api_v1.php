<?php

use App\Http\Controllers\api\v1\FontController;
use App\Http\Controllers\api\v1\TextController;
use App\Http\Controllers\api\v1\ImageController;
use App\Http\Controllers\api\v1\PlanController;
use App\Http\Controllers\api\v1\FrameController;
use App\Http\Controllers\api\v1\TemplateController;
use App\Http\Controllers\api\v1\UserController;
use App\Http\Controllers\api\v1\DesignController;

use App\Http\Controllers\api\v1\admin\UserController as AdminUserController;

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
    Route::post('/auth/signinWithToken', [UserController::class, 'signInWithToken']);

    Route::get('/texts', [TextController::class, 'getAll']);

    Route::get('/fonts', [FontController::class, 'getAll']);
    
    Route::get('/images', [ImageController::class, 'getAll']);
    
    Route::get('/frames', [FrameController::class, 'getAll']);
    
    Route::get('/templates', [TemplateController::class, 'getAll']);

    Route::get('/templates/list', [TemplateController::class, 'getTemplateList']);

    Route::prefix('plan')->group(function () {
        Route::get('/getUserPlans', [PlanController::class, 'getUserPlans']);
        Route::get('/getUserSubscription', [PlanController::class, 'getUserSubscription']);
        Route::get('/getCustomer', [PlanController::class, 'getCustomer']);
        Route::post('/subscribe', [PlanController::class, 'subscribe']);
        Route::get('/payment/change/{plan}', [PlanController::class, 'changePlan']);
        Route::get('/payment-cancel', [PlanController::class, 'cancel']);
        Route::get('/payment-restore', [PlanController::class, 'restorePlan']);
    });

    Route::prefix('design')->group(function () {
        Route::post('/save', [DesignController::class, 'saveDesign']);
        Route::post('/rename', [DesignController::class, 'renameDesign']);
        Route::post('/delete', [DesignController::class, 'deleteDesign']);
        Route::post('/duplicate', [DesignController::class, 'duplicateDesign']);
        Route::get('/list', [DesignController::class, 'listDesigns']);
    });
    
    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminUserController::class, 'getUsers']);
        Route::get('/users/{id}', [AdminUserController::class, 'getUser']);
        Route::post('/users/spoofing', [AdminUserController::class, 'spoofing']);
    });

});

// Public API
Route::group([
    'middleware' => ['api_public'],
], function () {
    Route::post('/auth/signup', [UserController::class, 'signUp']);
    Route::post('/auth/signin', [UserController::class, 'signIn']);
});
