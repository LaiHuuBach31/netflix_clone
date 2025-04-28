<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            // Users
            ['name' => 'get_users'],
            ['name' => 'show_user'],
            ['name' => 'create_user'],
            ['name' => 'update_user'],
            ['name' => 'delete_user'],
            // Roles
            ['name' => 'get_role'],
            ['name' => 'show_role'],
            ['name' => 'create_role'],
            ['name' => 'update_role'],
            ['name' => 'delete_role'],
            // Permissions
            ['name' => 'get_permissions'],
            ['name' => 'show_permission'],
            ['name' => 'create_permission'],
            ['name' => 'update_permission'],
            ['name' => 'delete_permission'],
            // Genres
            ['name' => 'get_genres'],
            ['name' => 'show_genre'],
            ['name' => 'create_genre'],
            ['name' => 'update_genre'],
            ['name' => 'delete_genre'],
            // Plans
            ['name' => 'get_plans'],
            ['name' => 'show_plan'],
            ['name' => 'create_plan'],
            ['name' => 'update_plan'],
            ['name' => 'delete_plan'],
            // Upload
            ['name' => 'preview_upload'],
            ['name' => 'upload_image'],
            ['name' => 'upload_video'],
            // Menus
            ['name' => 'get_menu'],
            ['name' => 'show_menu'],
            ['name' => 'create_menu'],
            ['name' => 'update_menu'],
            ['name' => 'delete_menu'],
            // Movies
            ['name' => 'get_movies'],
            ['name' => 'show_movie'],
            ['name' => 'create_movie'],
            ['name' => 'update_movie'],
            ['name' => 'delete_movie'],
            // Banners
            ['name' => 'get_banners'],
            ['name' => 'show_banner'],
            ['name' => 'create_banner'],
            ['name' => 'update_banner'],
            ['name' => 'delete_banner'],
            // Subscriptions
            ['name' => 'get_subscriptions'],
            ['name' => 'show_subscription'],
            ['name' => 'create_subscription'],
            ['name' => 'update_subscription'],
            ['name' => 'delete_subscription'],
            // Watch History
            ['name' => 'get_watch_history'],
            ['name' => 'show_watch_history'],
            ['name' => 'create_watch_history'],
            ['name' => 'update_watch_history'],
            ['name' => 'delete_watch_history'],
            // Ratings
            ['name' => 'get_ratings'],
            ['name' => 'show_rating'],
            ['name' => 'create_rating'],
            ['name' => 'update_rating'],
            ['name' => 'delete_rating'],
            // Favourites
            ['name' => 'get_favourites'],
            ['name' => 'show_favourite'],
            ['name' => 'create_favourite'],
            ['name' => 'update_favourite'],
            ['name' => 'delete_favourite'],
            // Comments
            ['name' => 'get_comments'],
            ['name' => 'show_comment'],
            ['name' => 'create_comment'],
            ['name' => 'update_comment'],
            ['name' => 'delete_comment'],
            // Genre-Movie
            ['name' => 'get_genre_movie'],
            ['name' => 'show_genre_movie'],
            ['name' => 'create_genre_movie'],
            ['name' => 'update_genre_movie'],
            ['name' => 'delete_genre_movie'],
            // User-Role
            ['name' => 'get_user_role'],
            ['name' => 'show_user_role'],
            ['name' => 'create_user_role'],
            ['name' => 'update_user_role'],
            ['name' => 'delete_user_role'],
            // Role-Permission
            ['name' => 'get_role_permission'],
            ['name' => 'show_role_permission'],
            ['name' => 'create_role_permission'],
            ['name' => 'update_role_permission'],
            ['name' => 'delete_role_permission'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission['name']], $permission);
        }

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminPermissions = Permission::all()->pluck('id');
        $adminRole->permissions()->sync($adminPermissions);

        // $userRole = Role::where('name', 'user')->first();
        // if ($userRole) {
        //     $userPermissions = Permission::whereIn('name', [
        //         'get_movies',
        //         'get_genres',
        //         'get_plans',
        //         'get_menu',
        //         'get_banners',
        //         'get_subscriptions',
        //         'get_watch_history',
        //         'get_ratings',
        //         'get_favourites',
        //         'get_comments',
        //         'create_watch_history',
        //         'create_rating',
        //         'create_favourite',
        //         'create_comment'
        //     ])->pluck('id');
        //     $userRole->permissions()->sync($userPermissions);
        // }

        // $adminRole = Role::where('name', 'admin')->first();
        // if ($adminRole) {
        //     $adminPermissions = Permission::all()->pluck('id');
        //     $adminRole->permissions()->sync($adminPermissions);
        // }

    }
}
