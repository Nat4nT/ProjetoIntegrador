<?php

namespace Controllers;

use Services\UsuarioService;
use Helpers\JsonResponse;
use Services\EmailService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class UsuarioController
{
    public function AlterarSenha(Request $request, Response $response)
    {
        $dadosUsuario = $request->getAttribute('usuario');
        $dadosFormulario = $request->getParsedBody();
        $resposta = (new UsuarioService())->alterarSenha($dadosUsuario, $dadosFormulario);
        $jsonResponse = new JsonResponse();
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }

    public function realizarCadastro(Request $request, Response $response): Response

    {
        $data = $request->getParsedBody();
        $uploadedFiles = $request->getUploadedFiles();
        $data['files'] = $uploadedFiles;
        $jsonResponse = new JsonResponse();

        if (is_null($data) || empty($data) || !isset($data['consentimento_lgpd']) || $data['consentimento_lgpd'] == 0) {
            return   $jsonResponse->emitirResposta($response, ['message' => "Não consente com a LGPD", 'code' => 400], 400);
        }

        $resposta = (new UsuarioService())->realizarCadastro($data);


        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], "data" => ['token' => @$resposta['token'], 'firstname' => @$resposta['firstname'], 'lastname' => @$resposta['lastname'], 'user_photo' => @$resposta['user_photo']], 'code' => $resposta['code']], $resposta['code']);
    }

    public function pegarDadosConta(Request $request, Response $response): Response
    {
        $dadosUsuario = $request->getAttribute('usuario');
        $resposta = (new UsuarioService())->buscarDados($dadosUsuario);
        $jsonResponse = new JsonResponse();
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'data' => $resposta['data'], 'code' => $resposta['code']], $resposta['code']);
    }

    public function editarUsuario(Request $request, Response $response): Response
    {
        $dadosUsuario = $request->getAttribute('usuario');
        $dadosFormulario = $request->getParsedBody();
        $uploadedFiles = $request->getUploadedFiles();
        $dadosFormulario['imagem_perfil'] = $uploadedFiles;


        $resposta = (new UsuarioService())->editarUsuario($dadosUsuario, $dadosFormulario);
        return (new JsonResponse())->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }

    public function desativarPerfil(Request $request, Response $response): Response
    {
        $dadosUsuario = $request->getAttribute('usuario');
        $resposta = (new UsuarioService())->desativar($dadosUsuario->usuario_id);
        $jsonResponse = new JsonResponse();

        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }

    public function ativacaoDeConta(Request $request, Response $response)
    {
        $email = $request->getParsedBody()['email'];
        $resposta = (new EmailService())->genereteActiveCode($email);
        $jsonResponse = new JsonResponse();

        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }
    public function recuperacaoDeConta(Request $request, Response $response)
    {
        $email = $request->getParsedBody()['email'];
        $resposta = (new EmailService())->genereteRecupCode($email);
        $jsonResponse = new JsonResponse();

        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }



    public function reativacaoDeConta(Request $request, Response $response)
    {
        $email = $request->getParsedBody()['email'];
        $resposta = (new EmailService())->genereteReativCode($email);
        $jsonResponse = new JsonResponse();

        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }

    public function validarCodigoRecup(Request $request, Response $response)
    {
        $dados = $request->getParsedBody();

        $resposta = (new EmailService())->validateCode($dados['email'], $dados['validation_code']);

        $jsonResponse = new JsonResponse();

        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], "data" => @$resposta['data'] ?: [], 'code' => $resposta['code']], $resposta['code']);
    }

    public function aceitarSolicitacao(Request $request, Response $response)
    {
        $dadosFormulario = $request->getParsedBody()['solicitacao_id'];
        $jsonResponse = new JsonResponse();
        $resposta = (new UsuarioService())->aceitarSolicitacao($dadosFormulario);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'],  'code' => $resposta['code']], $resposta['code']);
    }
    public function revogarSolicitacao(Request $request, Response $response)
    {
        $dadosFormulario = $request->getParsedBody()['solicitacao_id'];
        $jsonResponse = new JsonResponse();
        $resposta = (new UsuarioService())->revogarSolicitacao($dadosFormulario);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'],  'code' => $resposta['code']], $resposta['code']);
    }
    public function negarSolicitacao(Request $request, Response $response)
    {
        $dadosFormulario = $request->getParsedBody()['solicitacao_id'];
        $jsonResponse = new JsonResponse();
        $resposta = (new UsuarioService())->negarSolicitacao($dadosFormulario);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'],  'code' => $resposta['code']], $resposta['code']);
    }
}
