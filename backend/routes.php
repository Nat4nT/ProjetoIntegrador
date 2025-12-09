<?php

use Controllers\LoginController;
use Controllers\UsuarioController;
use Controllers\CategoriaController;
use Controllers\CondicaoController;
use Controllers\ExameController;
use Controllers\MedicoController;
use Controllers\PacienteController;
use Middlewares\AutenticacaoMiddleware;
use Middlewares\LogMiddleware;
use Middlewares\TipeMiddleware;
use Slim\App;


return function (App $app) {

    $app->post('/login', [LoginController::class, 'realizarLogin'])->add(LogMiddleware::class);
    $app->post('/registrar', [UsuarioController::class, 'realizarCadastro'])->add(LogMiddleware::class);
    $app->post('/ativar-conta', [UsuarioController::class, 'ativacaoDeConta'])->add(LogMiddleware::class);
    $app->post('/recuperar-conta', [UsuarioController::class, 'recuperacaoDeConta'])->add(LogMiddleware::class);
    $app->post('/reativar-conta', [UsuarioController::class, 'reativacaoDeConta'])->add(LogMiddleware::class);
    $app->post('/verificar-codigo', [UsuarioController::class, 'validarCodigoRecup'])->add(LogMiddleware::class);

    $app->group('/minha-conta', function ($user) {
        $user->get('', [UsuarioController::class, 'pegarDadosConta']);
        $user->post('', [UsuarioController::class, 'editarUsuario']);
        $user->post('/deletar', [UsuarioController::class, 'desativarPerfil']);
        $user->post('/alterar-senha', [UsuarioController::class, 'alterarSenha']);
        $user->group('/solicitacoes', function ($solicitacao) {
            $solicitacao->get('', [PacienteController::class, 'buscarSolicitacoes']);
            $solicitacao->post('/negar', [UsuarioController::class, 'negarSolicitacao']);
            $solicitacao->post('/revogar', [UsuarioController::class, 'revogarSolicitacao']);
            $solicitacao->post('/aprovar', [UsuarioController::class, 'aceitarSolicitacao']);
        });
    })->add(LogMiddleware::class)->add(AutenticacaoMiddleware::class);

    $app->get('/condicoes', [CondicaoController::class, 'index'])->add(AutenticacaoMiddleware::class);

    $app->group('/categoria', function ($cat) {
        $cat->get('', [CategoriaController::class, 'index']);
        $cat->post('', [CategoriaController::class, 'create']);
        $cat->post('/editar', [CategoriaController::class, 'edit']);
        $cat->post('/deletar', [CategoriaController::class, 'delete']);
    })->add(LogMiddleware::class)->add(AutenticacaoMiddleware::class);



    $app->group("/medico", function ($med) {
        $med->post('/solicitar-acesso', [MedicoController::class, 'solicitarAcesso']);
        $med->post('/buscar', [MedicoController::class, 'buscarPaciente']);
        $med->post('/buscar-exames', [MedicoController::class, "buscarExamesPaciente"]);
        $med->post('/buscar-exame', [MedicoController::class, "buscarExamePaciente"]);
        $med->post('/buscar-categorias', [MedicoController::class, "buscarCategoriasPaciente"]);
        $med->get('/pacientes', [MedicoController::class, 'buscarPacientes']);
    })->add(LogMiddleware::class)->add(TipeMiddleware::class)->add(AutenticacaoMiddleware::class);

    $app->group('/exames', function ($exam) {
        $exam->get('', [ExameController::class, 'index']);
        $exam->post('/buscar-exame', [ExameController::class, 'getExame']);
        $exam->post('/adicionar', [ExameController::class, 'create']);
        $exam->post('/editar', [ExameController::class, 'edit']);
        $exam->post('/deletar', [ExameController::class, 'delete']);
        $exam->post('/criar-comentario', [ExameController::class, 'criarComentario'])->add(TipeMiddleware::class);
        $exam->post('/editar-comentario', [ExameController::class, 'editarComentario'])->add(TipeMiddleware::class);
        $exam->post('/deletar-comentario', [ExameController::class, 'deletarComentario'])->add(TipeMiddleware::class);
    })->add(LogMiddleware::class)->add(AutenticacaoMiddleware::class);
};
