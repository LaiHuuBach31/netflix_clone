<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ErrorExport implements FromArray, WithHeadings
{
    protected $errors;

    public function __construct(array $errors)
    {
        $this->errors = $errors;
    }

    public function array(): array
    {
        $formattedErrors = [];
        foreach ($this->errors as $error) {
            $rowData = $error['row_data'];
            foreach ($error['errors'] as $errorMessage) {
                $formattedErrors[] = [
                    'Row' => array_key_first($this->errors) + 1,
                    'Data' => json_encode($rowData),
                    'Error Message' => $errorMessage,
                ];
            }
        }
        return $formattedErrors;
    }

    public function headings(): array
    {
        return ['Row', 'Data', 'Error Message'];
    }
}
