<?php

namespace Services;

class ImagemService
{
    public function uploadImage(array $file, Object $user, $table)
    {
        // Utilizado para caso seja enviado mais de uma imagem.
        foreach ($file as $foto) {
            // Verifica se o arquvio é valido
            if (!isset($foto['name']) || $foto['error'] !== UPLOAD_ERR_OK) {
                return false;
            }

            $extensao = pathinfo($foto['name'], PATHINFO_EXTENSION);
            $nome_imagem = uniqid('img_', false) . '.' . strtolower($extensao);

            //Formatação de pasta imagems, para uma melhor organização e caso necessario manutenção, optou-se por usar a tabela como primeiro paramtro, o email (campo unico na tabela), ano e mes do envio.
            $uploadDir = __DIR__ . "/../../uploads/{$table}/{$user->email}/" . date('Y') . "/" . date('m') . "/";

            // Verifica se a pasta existe, caso não exista cria.
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $destination = $uploadDir . $nome_imagem;

            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

            // Verificação se a imagem é um tipo aceito
            if (!in_array(strtolower($extensao), $allowedTypes)) {
                return false;
            }

            if (move_uploaded_file($foto['tmp_name'], $destination)) {
                // Retorna o link relativo da imagem
                return '/uploads/' . $destination;
            } else {
                return false;
            }
        }
        return false; // Falha no upload
    }

    public function deleteFile(object $object)
    {
        if (isset($object->foto)) {
            unlink(__DIR__ . '/../../' . $object->foto);
        }
    }
}
