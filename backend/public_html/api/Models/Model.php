<?php

namespace Api\Models;

use Psr\Http\Message\UploadedFileInterface; // Necessário para a tipagem

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
    public function getInfo()
    {
        $sql = "SELECT * FROM {$this->table} WHERE {$this->id_column_name} =:id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }



    public function getData(array $options = []): array
    {
        $defaults = [
            'where' => '1=1',
            'order_by' => $this->id_column_name,
            'sort' => 'DESC',
            'limit' => null,
        ];

        $params = array_merge($defaults, $options);

        $sql = "SELECT * FROM {$this->table} WHERE {$params['where']} ORDER BY {$params['order_by']} {$params['sort']}";

        if (!empty($params['limit']) && is_numeric($params['limit'])) {
            $sql .= " LIMIT :limit";
        }

        $stmt = $this->conn->prepare($sql);

        if (!empty($params['limit']) && is_numeric($params['limit'])) {
            $stmt->bindValue(':limit', (int)$params['limit'], PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function AddData(array $dados): int
    {
        $imageFields = ['imagem_perfil', 'arquivo_exame'];
        $uploadedFiles = $dados['files'] ?? [];

        unset($dados['files']);

        foreach ($imageFields as $fieldName) {
            if (isset($uploadedFiles[$fieldName])) {
                $fileObject = $uploadedFiles[$fieldName];
                if ($fileObject->getError() === UPLOAD_ERR_OK) {
                    $fotoCaminho = $this->uploadImage($fileObject);
                    if ($fotoCaminho !== null) {

                        $dados[$fieldName] = $fotoCaminho;
                    } else {
                        unset($dados[$fieldName]);
                    }
                }
            }
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
        $imageFields = ['imagem_perfil', 'imagem_exame'];
        $uploadedFiles = $dados['files'] ?? [];
        unset($dados['files']);


        foreach ($imageFields as $fieldName) {
            $fileObject = $uploadedFiles[$fieldName] ?? null;

            if ($fileObject && $fileObject->getError() === UPLOAD_ERR_OK) {

                $currentData = $this->getInfo();
                if (isset($currentData[$fieldName]) && $currentData[$fieldName]) {
                    $this->deleteFile($currentData[$fieldName]);
                }

                $uploadResult = $this->uploadImage($fileObject);

                if ($uploadResult === null) {

                    unset($dados[$fieldName]);
                } else {
                    $dados[$fieldName] = $uploadResult;
                }
            } else {
                unset($dados[$fieldName]);
            }
        }

        $set = [];
        foreach ($dados as $col => $val) {
            $set[] = "`$col` = :$col";
        }

        $sql = "UPDATE {$this->table} SET " . implode(', ', $set) . " WHERE {$this->id_column_name} = :id";
        $stmt = $this->conn->prepare($sql);
        $dados['id'] = $this->id;
        $stmt->execute(params: $dados);

        return $stmt->rowCount();
    }

    public function deleteData(): bool
    {
        $data = $this->getInfo();
        $file_field = ['imagem_exame', 'imagem_perfil'];
        foreach ($file_field as $file) {
            if (isset($data[$file])) {
                $this->deleteFile($data[$file]);
            }
        }

        $sql = "DELETE FROM {$this->table} WHERE {$this->id_column_name} = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function deleteFile($arquivo): void
    {
        unlink(__DIR__ . '/../../' . $arquivo);
    }

    public function uploadImage(UploadedFileInterface $fileObject): ?string // Mudança: Recebe o objeto
    {

        if ($fileObject->getError() !== UPLOAD_ERR_OK) {
            return null;
        }
        $tableParts = explode('_', $this->table);
        $subdir = end($tableParts);
        $uploadDir = __DIR__ . "/../../uploads/{$subdir}/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);


        $clientFilename = $fileObject->getClientFilename();
        $extension = strtolower(pathinfo($clientFilename, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];

        if (!in_array($extension, $allowedTypes)) return null;


        $filename = uniqid('img_', true) . '.' . $extension;
        $destination = $uploadDir . $filename;


        try {
            $fileObject->moveTo($destination);
            return '/uploads/' . $subdir . '/' . $filename;
        } catch (\Throwable $e) {

            return null;
        }
    }
}
