<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Services\MenuService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MenuController extends BaseController
{

    protected $menuService;

    public function __construct(MenuService $menuService) {
        $this->menuService = $menuService;
    }   

    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        return $this->handleIndex($this->menuService, 'name', $search, $perPage);
    }

    public function show(int $id) {
        return $this->handleShow($this->menuService, $id);
    }

    public function store(Request $request) {
        
        $data = [
            "title" => $request->title,
            "parent_id" => $request->parent_id ?? 0,
            "is_active" => $request->is_active ?? true,
        ];
        
        try {
            $menu = $this->menuService->createMenu($data);
            return $this->createdResponse($menu, 'Menu created successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function update(Request $request, int $id)
    {
        $data = array_merge(['id' => $id], $request->all());

        try {
            $menu = $this->menuService->updateMenu($id, $data);
            return $this->okResponse($menu, 'Menu updated successfully');
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        }
    }

    public function destroy(int $id)
    {
        $this->deleteRecursive($id);
        return $this->handleDelete($this->menuService, $id, 'Menu');
    }

    private function deleteRecursive(int $id){

        $children = Menu::where('parent_id', $id)->get();

        foreach ($children as $key => $child) {
            $this->deleteRecursive($child->id);
            $child->delete();
        }

    }
}
