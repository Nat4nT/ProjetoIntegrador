<?php

use Api\Controllers\LoginController;
use Api\Controllers\UsuarioController;
use Api\Controllers\CategoriaController;
use Api\Controllers\CondicaoController;
use Api\Controllers\ExameController;
use Api\Controllers\MedicoController;
use Api\Controllers\PacienteController;
use Api\Middlewares\AutenticacaoMiddleware;
use Api\Middlewares\TipeMiddleware;
use Slim\App;


// caminho :C:\Users\Natan\Documents\Natan\TADS\Codigos\MedHUBApi\public_html\Api\routes.php

return function (App $app) {

    $app->post('/login', [LoginController::class, 'realizarLogin']);
    $app->post('/registrar', [UsuarioController::class, 'realizarCadastro']);


    $app->group('/minha-conta', function ($user) {
        $user->get('', [UsuarioController::class, 'pegarDadosConta']);
        $user->post('', [UsuarioController::class, 'editarUsuario']);
        $user->post('/deletar', [UsuarioController::class, 'desativarPerfil']);
        $user->group('/solicitacoes', function ($solicitacao) {
            $solicitacao->get('', [PacienteController::class, 'buscarSolicitacoes']);
            $solicitacao->post('/negar', [PacienteController::class, 'negarSolicitacao']);
            $solicitacao->post('/aprovar', [PacienteController::class, 'aceitarSolicitacao']);

        });
    })->add(AutenticacaoMiddleware::class);

    $app->get('/condicoes', [CondicaoController::class, 'index'])->add(AutenticacaoMiddleware::class);

    $app->group('/categoria', function ($cat) {
        $cat->get('', [CategoriaController::class, 'index']);
        $cat->post('', [CategoriaController::class, 'create']);
        $cat->post('/deletar', [CategoriaController::class, 'delete']);
    })->add(AutenticacaoMiddleware::class);


    
    $app->group("/medico", function ($med) {
        $med->post('/solicitar-acesso',[MedicoController::class,'solicitarAcesso']);
        $med->post('/buscar',[MedicoController::class,'buscarPaciente']);
        $med->post('/buscar-exames',[MedicoController::class,"buscarExamesPaciente"]);
    })->add(TipeMiddleware::class)->add(AutenticacaoMiddleware::class);

    $app->group('/exames', function ($exam) {
        $exam->get('', [ExameController::class, 'index']);
        $exam->post('/buscar-exame', [ExameController::class, 'getExame']);
        $exam->post('/adicionar', [ExameController::class, 'create']);
        $exam->post('/editar', [ExameController::class, 'edit']);
        $exam->post('/deletar', [ExameController::class, 'delete']);
    })->add(AutenticacaoMiddleware::class);


    $app->post('/teste', function ($request, $response) {
        $authorizationHeader = $request->getHeaderLine('Authorization');
        var_dump($authorizationHeader);
        die;
    });
};
