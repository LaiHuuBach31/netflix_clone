<?php
namespace App\Exports;

use App\Repositories\UserRepository;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UsersExport implements FromCollection, WithHeadings {

    protected $userRepository;

    public function __construct(UserRepository $userRepository) {
        $this->userRepository = $userRepository;
    }

    public function collection() {
        $users = $this->userRepository->getDataExport();
        return $users->map( function ($user) {
            return [
                'ID' => $user->id,
                'Name' => $user->name,
                'Email' => $user->email,
                'Avatar' => $user->avatar ?? 'N/A', 
                'Status' => $user->status == 1 ? 'Active' : 'Inactive', 
                'Created At' => $user->created_at->format('Y-m-d H:i:s'), 
            ];
        });
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Avatar',
            'Status',
            'Created At',
        ];
    }
}