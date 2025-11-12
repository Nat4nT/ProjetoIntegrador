<?php

namespace Api\Services;

use Api\Helpers\Token;
use Api\Models\UsuarioModel;

class AutenticacaoService
{

    public function realizarLogin($email_login, $senha)
    {

        $usuario = (new UsuarioModel())->buscarPorEmail($email_login);

        if (!$usuario) return null;

        if (!password_verify($senha, $usuario->senha)) return null;

        $data = [
            'token' => Token::gerarToken([
                'usuario_id' => $usuario->usuario_id,
                'tipo_usuario' => $usuario->tipo_usuario
            ]),
            'firstname' => $usuario->primeiro_nome,
            'lastname' => $usuario->ultimo_nome,
            'imagem_perfil' => $usuario->imagem_perfil,
            'status' => $usuario->status
        ];

        return $data;
    }
}
