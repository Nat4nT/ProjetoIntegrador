<?php

namespace App\Models;

use PDO;

abstract class Model
{
    protected PDO $conn;
    public $id;
    protected $table;
    protected  $id_column_name;

    public function __construct(int $id = 0)
    {
        $this->id = $id;
        $this->conn = (new DB())->conn();
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }


    public function getData(string $where = '1=1', ?string $order_by = null, string $sort = 'DESC', int $limit = 20): array
    {
        $order_by = $order_by ?: $this->id_column_name;
        $sql = "SELECT * FROM {$this->table} WHERE {$where} ORDER BY {$order_by} {$sort} LIMIT :limit";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function AddData(array $dados): int
    {
        if (isset($dados['files'])) {
            $foto = $this->uploadImage($dados['files']);
            if ($foto === null) {
                return 0;
            }
            $dados['foto'] = $foto;
            unset($dados['files']);
        }

        $colunas = array_keys($dados);
        $placeholders = array_map(fn($c) => ":$c", $colunas);

        $sql = "INSERT INTO {$this->table} (" . implode(',', $colunas) . ") VALUES (" . implode(',', $placeholders) . ")";
        $stmt = $this->conn->prepare($sql);

        foreach ($dados as $col => $val) {
            $stmt->bindValue(":$col", $val);
        }

        $stmt->execute();
        return (int)$this->conn->lastInsertId();
    }

    public function editData(array $dados): bool
    {
        $set = [];
        foreach ($dados as $col => $val) {
            $set[] = "`$col` = :$col";
        }

        $sql = "UPDATE {$this->table} SET " . implode(', ', $set) . " WHERE {$this->id_column_name} = :id";
        $stmt = $this->conn->prepare($sql);
        $dados['id'] = $this->id;
        $stmt->execute(params: $dados);
        
        return $stmt->rowCount() > 0;
    }

    public function deleteData(): bool
    {
        $sql = "DELETE FROM {$this->table} WHERE {$this->id_column_name} = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function deleteFile(object $object): void
    {
        if (isset($object->foto) && file_exists(__DIR__ . '/../Views' . $object->foto)) {
            unlink(__DIR__ . '/../Views' . $object->foto);
        }
    }

    public function uploadImage(array $files): ?string
    {
        $subdir = end(explode('_', $this->table));

        foreach ($files as $file) {
            if (!isset($file['name'], $file['tmp_name']) || $file['error'] !== UPLOAD_ERR_OK) {
                return null;
            }

            $uploadDir = __DIR__ . "/../../uploads/{$subdir}/";
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

            if (!in_array($extension, $allowedTypes)) return null;

            $mimeType = mime_content_type($file['tmp_name']);
            if (!str_starts_with($mimeType, 'image/')) return null;

            $filename = uniqid('img_', true) . '.' . $extension;
            $destination = $uploadDir . $filename;

            if (move_uploaded_file($file['tmp_name'], $destination)) {
                return '/uploads/' . $subdir . '/' . $filename;
            }
        }

        return null;
    }
}
