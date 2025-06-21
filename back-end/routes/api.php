<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\EpisodesController;
use App\Http\Controllers\Api\FavouriteController;
use App\Http\Controllers\Api\FileUploadController;
use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\GenreMovieController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\RolePermissionController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserRoleController;
use App\Http\Controllers\Api\WatchHistoryController;
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
    Route::post('/register', [AuthController::class, 'register'])->name('register');

    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user', [AuthController::class, 'getUser'])->middleware('auth:api');

    Route::get('/users/{email}', [UserController::class, 'findUserByEmail']);
    Route::group(['prefix' => 'users', 'middleware' => ['auth:api']], function () {
        Route::get('/', [UserController::class, 'index'])->middleware('check.permission:get_users');
        Route::get('/export', [UserController::class, 'export'])->middleware('check.permission:export_user');
        Route::post('/import', [UserController::class, 'import'])->middleware('check.permission:import_user');
        Route::get('/{id}', [UserController::class, 'show'])->middleware('check.permission:show_user');
        Route::post('/', [UserController::class, 'store'])->middleware('check.permission:create_user');
        Route::patch('/{id}', [UserController::class, 'update'])->middleware('check.permission:update_user');
        Route::delete('/{id}', [UserController::class, 'destroy'])->middleware('check.permission:delete_user');
    });

    Route::group(['prefix' => 'roles', 'middleware' => ['auth:api']], function () {
        Route::get('/', [RoleController::class, 'index'])->middleware('check.permission:get_role');
        Route::get('/{id}', [RoleController::class, 'show'])->middleware('check.permission:show_role');
        Route::post('/', [RoleController::class, 'store'])->middleware('check.permission:create_role');
        Route::put('/{id}', [RoleController::class, 'update'])->middleware('check.permission:update_role');
        Route::delete('/{id}', [RoleController::class, 'destroy'])->middleware('check.permission:delete_role');
    });

    Route::group(['prefix' => 'permissions', 'middleware' => ['auth:api']], function () {
        Route::get('/', [PermissionController::class, 'index'])->middleware('check.permission:get_permissions');
        Route::get('/{id}', [PermissionController::class, 'show'])->middleware('check.permission:show_permission');
        Route::post('/', [PermissionController::class, 'store'])->middleware('check.permission:create_permission');
        Route::put('/{id}', [PermissionController::class, 'update'])->middleware('check.permission:update_permission');
        Route::delete('/{id}', [PermissionController::class, 'destroy'])->middleware('check.permission:delete_permission');
    });

    Route::group(['prefix' => 'genres', 'middleware' => ['auth:api']], function () {
        Route::get('/', [GenreController::class, 'index'])->middleware('check.permission:get_genres');
        Route::get('/{id}', [GenreController::class, 'show'])->middleware('check.permission:show_genre');
        Route::post('/', [GenreController::class, 'store'])->middleware('check.permission:create_genre');
        Route::put('/{id}', [GenreController::class, 'update'])->middleware('check.permission:update_genre');
        Route::delete('/{id}', [GenreController::class, 'destroy'])->middleware('check.permission:delete_genre');
    });

    Route::get('/plans', [PlanController::class, 'index']);
    Route::get('/plans/{id}', [PlanController::class, 'show']);
    Route::group(['prefix' => 'plans', 'middleware' => ['auth:api']], function () {
        Route::post('/', [PlanController::class, 'store'])->middleware('check.permission:create_plan');
        Route::put('/{id}', [PlanController::class, 'update'])->middleware('check.permission:update_plan');
        Route::delete('/{id}', [PlanController::class, 'destroy'])->middleware('check.permission:delete_plan');
    });

    Route::group(['prefix' => 'upload'], function () {
        Route::get('/preview', [FileUploadController::class, 'preview']);
        Route::post('/image', [FileUploadController::class, 'uploadImage']);
        Route::post('/video', [FileUploadController::class, 'uploadVideo']);
        Route::delete('{filename}', [FileUploadController::class, 'deleteFile']);
    });

    Route::group(['prefix' => 'menus', 'middleware' => ['auth:api']], function () {
        Route::get('/', [MenuController::class, 'index'])->middleware('check.permission:get_menu');
        Route::get('/{id}', [MenuController::class, 'show'])->middleware('check.permission:show_menu');
        Route::post('/', [MenuController::class, 'store'])->middleware('check.permission:create_menu');
        Route::put('/{id}', [MenuController::class, 'update'])->middleware('check.permission:update_menu');
        Route::delete('/{id}', [MenuController::class, 'destroy'])->middleware('check.permission:delete_menu');
    });

    Route::group(['prefix' => 'movies', 'middleware' => ['auth:api']], function () {
        Route::get('/', [MovieController::class, 'index'])->middleware('check.permission:get_movies');
        Route::get('/{id}', [MovieController::class, 'show'])->middleware('check.permission:show_movie');
        Route::post('/', [MovieController::class, 'store'])->middleware('check.permission:create_movie');
        Route::put('/{id}', [MovieController::class, 'update'])->middleware('check.permission:update_movie');
        Route::delete('/{id}', [MovieController::class, 'destroy'])->middleware('check.permission:delete_movie');
    });

    Route::group(['prefix' => 'episodes', 'middleware' => ['auth:api']], function () {
        Route::get('/', [EpisodesController::class, 'index'])->middleware('check.permission:get_episodes');
        Route::get('/{id}', [EpisodesController::class, 'show'])->middleware('check.permission:show_episode');
        Route::post('/', [EpisodesController::class, 'store'])->middleware('check.permission:create_episode');
        Route::put('/{id}', [EpisodesController::class, 'update'])->middleware('check.permission:update_episode');
        Route::delete('/{id}', [EpisodesController::class, 'destroy'])->middleware('check.permission:delete_episodes');
    });

    Route::get('/banners', [BannerController::class, 'index']);
    Route::group(['prefix' => 'banners', 'middleware' => ['auth:api']], function () {
        Route::get('/{id}', [BannerController::class, 'show'])->middleware('check.permission:show_banner');
        Route::post('/', [BannerController::class, 'store'])->middleware('check.permission:create_banner');
        Route::put('/{id}', [BannerController::class, 'update'])->middleware('check.permission:update_banner');
        Route::delete('/{id}', [BannerController::class, 'destroy'])->middleware('check.permission:delete_banner');
    });

    Route::post('/subscriptions', [SubscriptionController::class, 'store']);
    Route::put('/subscriptions/{id}', [SubscriptionController::class, 'update']);
    Route::group(['prefix' => 'subscriptions', 'middleware' => ['auth:api']], function () {
        Route::get('/', [SubscriptionController::class, 'index'])->middleware('check.permission:get_subscriptions');
        Route::get('/user/{user_id}', [SubscriptionController::class, 'getSubscriptionByUser']);
        Route::get('/{id}', [SubscriptionController::class, 'show'])->middleware('check.permission:show_subscription');
        Route::delete('/{id}', [SubscriptionController::class, 'destroy'])->middleware('check.permission:delete_subscription');
    });

    Route::group(['prefix' => 'watch-history', 'middleware' => ['auth:api']], function () {
        Route::get('/', [WatchHistoryController::class, 'index'])->middleware('check.permission:get_watch_history');
        Route::get('/{id}', [WatchHistoryController::class, 'show'])->middleware('check.permission:show_watch_history');
        Route::post('/', [WatchHistoryController::class, 'store'])->middleware('check.permission:create_watch_history');
        Route::put('/{id}', [WatchHistoryController::class, 'update'])->middleware('check.permission:update_watch_history');
        Route::delete('/{id}', [WatchHistoryController::class, 'destroy'])->middleware('check.permission:delete_watch_history');
    });

    Route::group(['prefix' => 'ratings', 'middleware' => ['auth:api']], function () {
        Route::get('/', [RatingController::class, 'index'])->middleware('check.permission:get_ratings');
        Route::get('/{id}', [RatingController::class, 'show'])->middleware('check.permission:show_rating');
        Route::post('/', [RatingController::class, 'store'])->middleware('check.permission:create_rating');
        Route::put('/{id}', [RatingController::class, 'update'])->middleware('check.permission:update_rating');
        Route::delete('/{id}', [RatingController::class, 'destroy'])->middleware('check.permission:delete_rating');
    });

    Route::group(['prefix' => 'favourites', 'middleware' => ['auth:api']], function () {
        Route::get('/', [FavouriteController::class, 'index'])->middleware('check.permission:get_favourites');
        Route::get('/{id}', [FavouriteController::class, 'show'])->middleware('check.permission:show_favourite');
        Route::post('/', [FavouriteController::class, 'store'])->middleware('check.permission:create_favourite');
        Route::put('/{id}', [FavouriteController::class, 'update'])->middleware('check.permission:update_favourite');
        Route::delete('/{id}', [FavouriteController::class, 'destroy'])->middleware('check.permission:delete_favourite');
    });

    Route::group(['prefix' => 'comments', 'middleware' => ['auth:api']], function () {
        Route::get('/', [CommentController::class, 'index'])->middleware('check.permission:get_comments');
        Route::get('/{id}', [CommentController::class, 'show'])->middleware('check.permission:show_comment');
        Route::post('/', [CommentController::class, 'store'])->middleware('check.permission:create_comment');
        Route::put('/{id}', [CommentController::class, 'update'])->middleware('check.permission:update_comment');
        Route::delete('/{id}', [CommentController::class, 'destroy'])->middleware('check.permission:delete_comment');
    });

    Route::group(['prefix' => 'genre-movie', 'middleware' => ['auth:api']], function () {
        Route::get('/', [GenreMovieController::class, 'index'])->middleware('check.permission:get_genre_movie');
        Route::get('/{id}', [GenreMovieController::class, 'show'])->middleware('check.permission:show_genre_movie');
        Route::post('/', [GenreMovieController::class, 'store'])->middleware('check.permission:create_genre_movie');
        Route::put('/{id}', [GenreMovieController::class, 'update'])->middleware('check.permission:update_genre_movie');
        Route::delete('/{id}', [GenreMovieController::class, 'destroy'])->middleware('check.permission:delete_genre_movie');
    });

    Route::group(['prefix' => 'user-role', 'middleware' => ['auth:api']], function () {
        Route::get('/', [UserRoleController::class, 'index'])->middleware('check.permission:get_user_role');
        Route::get('/{id}', [UserRoleController::class, 'show'])->middleware('check.permission:show_user_role');
        Route::post('/', [UserRoleController::class, 'store'])->middleware('check.permission:create_user_role');
        Route::put('/{id}', [UserRoleController::class, 'update'])->middleware('check.permission:update_user_role');
        Route::delete('/{id}', [UserRoleController::class, 'destroy'])->middleware('check.permission:delete_user_role');
    });

    Route::group(['prefix' => 'role-permission', 'middleware' => ['auth:api']], function () {
        Route::get('/', [RolePermissionController::class, 'index'])->middleware('check.permission:get_role_permission');
        Route::get('/{id}', [RolePermissionController::class, 'show'])->middleware('check.permission:show_role_permission');
        Route::post('/', [RolePermissionController::class, 'store'])->middleware('check.permission:create_role_permission');
        Route::put('/{id}', [RolePermissionController::class, 'update'])->middleware('check.permission:update_role_permission');
        Route::delete('/{id}', [RolePermissionController::class, 'destroy'])->middleware('check.permission:delete_role_permission');
    });

    Route::group(['middleware' => ['auth:api']], function () {
        Route::patch('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    });
});
