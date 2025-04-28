<?php
namespace App\Services;

use App\DTOs\MenuDTO;
use App\Mapper\GenreMapper;
use App\Mapper\MenuMapper;
use App\Models\Menu;
use App\Repositories\MenuRepository;

class MenuService extends BaseService{

    public function __construct(MenuRepository $menuRpository) {
        $this->repository = $menuRpository;
    }

    public function getAll(?string $key = null ,?string $search = null, int $perPage = 10) {
        $menus = parent::getAll($key, $search, $perPage);
        return $menus->map(fn($menu) => MenuMapper::fromModel($menu));
    }

    public function findById($id) {
        $menu = parent::findById($id);
        return MenuMapper::fromModel($menu);
    }

    public function createMenu(array $data) {
        $order = Menu::where('parent_id', $data['parent_id'])->max('order') + 1;
        $data['order'] = $order;
        $dto = new MenuDTO($data, true);
        $created = parent::create($dto);
        return MenuMapper::fromModel($created);
    }

    public function updateMenu(int $id, array $data) {
        $dto = new MenuDTO($data, true);
        $updated = parent::update($id, $dto);
        return GenreMapper::fromModel($updated);
    }
}