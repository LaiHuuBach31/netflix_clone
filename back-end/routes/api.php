<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\GenresController;
use App\Http\Controllers\Api\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'namespace' => 'api'
], function () {

    Route::post('/login', [AuthController::class, 'login'])->name('login');

    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');

    Route::group(['prefix' => 'genres', 'middleware' => ['auth:api']], function () {
        Route::get('/', [GenreController::class, 'index']);
        Route::get('/{id}', [GenreController::class, 'show']);
        Route::post('/', [GenreController::class, 'store']);
        Route::put('/{id}', [GenreController::class, 'update']);
        Route::delete('/{id}', [GenreController::class, 'destroy']);
    });

    Route::group(['prefix' => 'roles', 'middleware' => ['auth:api']], function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::post('/', [RoleController::class, 'store']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
    });


});
