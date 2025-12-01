<?php

namespace Services;

use Models\CategoriaExameModel;
use Models\ComentarioExame;
use Models\ExameModel;
use DateTime;
use Exception;
use Models\MedicoModel;
use Models\UsuarioModel;

class ExameService
{
    public function getExames($id_usuario)
    {
        $exames = (new ExameModel())->getUserExames($id_usuario);
        return [
            "message" => "Exemes Encontrados",
            "data" => $exames,
            'code' => 200
        ];
    }
    private function validarCamposExame($dados)
    {
        $erro = 0;
        $mensagem = [];

        $uploadedFiles = $dados['files'] ?? [];

        $fileObject = $uploadedFiles['arquivo_exame'] ?? null;

        if (!$fileObject) {
            $erro = 1;
            $mensagem['arquivo_exame'] = "O arquivo de exame é obrigatório.";
        } elseif ($fileObject->getError() !== UPLOAD_ERR_OK) {
            $erro = 1;
            $mensagem['arquivo_exame'] = "Erro no upload do arquivo (Código: {$fileObject->getError()}). Verifique o tamanho.";
        }

        if (!isset($dados['nome_exame']) || is_null($dados['nome_exame'])) {
            $erro = 1;
            $mensagem['nome_exame'] = "Campo nome_exame invalido";
        }
        if (empty($dados['data_realizacao'])) {
            $erro = 1;
            $mensagem['data_realizacao'] = "Campo data_realizacao é obrigatório.";
        } else {
            try {
                $dataRealizacao = new DateTime($dados['data_realizacao']);
                $hoje = new DateTime('today');

                if ($dataRealizacao > $hoje) {
                    $erro = 1;
                    $mensagem['data_realizacao'] = "A data de realização não pode ser futura.";
                }
            } catch (Exception $e) {
                $erro = 1;
                $mensagem['data_realizacao'] = "Formato de data de realização inválido.";
            }
        }

        if (!isset($dados["nome_lab"]) || is_null($dados["nome_lab"])) {
            $erro = 1;
            $mensagem["nome_lab"] = "Campo nome_lab invalido.";
        }
        if (!isset($dados["categorias"]) || is_null($dados["categorias"])) {
            $erro = 1;
            $mensagem["categorias"] = "Campo categorias invalido.";
        }


        return [
            'erro' => $erro,
            'mensagem' => $mensagem
        ];
    }
    private function prepareExameData($dados, $usuario_id)
    {
        $validacao = $this->validarCamposExame($dados);

        if ($validacao['erro']) {
            return ["message" => $validacao['mensagem'], 'error' => 1];
        }

        return [
            "exame" => [
                'usuario_id' => $usuario_id,
                'nome_exame' => $dados['nome_exame'],
                'data_realizacao' => $dados['data_realizacao'],
                'files' => $dados['files'],
                'nome_lab' => $dados['nome_lab']
            ],
            "categorias" => $dados["categorias"],
        ];
    }
    public function addExame($dadosUsuario, $dadosFormulario)
    {
        $retonro_erro = [];

        if (empty($dadosFormulario)) {
            return ['code' => 401, 'message' => "Dados Inválidos"];
        }
        $dadosExame = $this->prepareExameData($dadosFormulario, $dadosUsuario->usuario_id);

        if (isset($dadosExame['error'])) {
            $retonro_erro[] = ['code' => 400, 'message' => $dadosExame['message']];
        }

        if (!empty($retonro_erro)) {
            return ['code' => 400, 'message' => json_encode($retonro_erro)];
        }
        $exame_id = (new ExameModel())->AddData($dadosExame['exame']);
        $categoriaExameModel = new CategoriaExameModel();
        foreach ($dadosExame['categorias'] as $cat_id) {
            $data = [
                "exame_id" => $exame_id,
                'categoria_id' => (int) $cat_id
            ];
            $categoriaExameModel->AddData($data);
        }
        return ['code' => 200, 'message' => 'Exame registrado com sucesso'];
    }
    public function editExame($dadosUsuario, $dadosFormulario)
    {

        if (empty($dadosFormulario)) {
            return ['code' => 401, 'message' => "Dados Inválidos"];
        }


        $dadosExame = $this->prepareExameData($dadosFormulario, $dadosUsuario->usuario_id);

        if (isset($dadosExame['error'])) {
            $retonro_erro[] = ['code' => 400, 'message' => $dadosExame['message']];
        }

        if (!empty($retonro_erro)) {
            return ['code' => 400, 'message' => json_encode($retonro_erro)];
        }

        $exame_id = $dadosFormulario["exame_id"];

        (new ExameModel($exame_id))->editData($dadosExame['exame']);

        $categoriaExameModel = new CategoriaExameModel();
        $categoriaExameModel->deleteAll($exame_id);

        foreach ($dadosExame['categorias'] as $cat_id) {
            $data = [
                "exame_id" => $exame_id,
                'categoria_id' => (int) $cat_id
            ];
            $categoriaExameModel->AddData($data);
        }
        return ['code' => 200, 'message' => 'Exame editado com sucesso'];
    }
    public function getExame($id_exame)
    {
        $exame_data = (new ExameModel($id_exame))->getExame();
        if (is_null($exame_data)) {
            return ['code' => 400, 'message' => 'Exame não encontrado', "data" => []];
        }

        return [
            'message' => 'Dados e comentario do Exame',
            'data' => $exame_data,
            'code' => 200
        ];
    }
    public function deleteExame($id_exame)
    {
        if (!$id_exame) {
            return ['code' => 400, 'message' => 'Exame invalido'];
        }
        (new CategoriaExameModel())->deleteAll($id_exame);
        (new ExameModel($id_exame))->deleteData();
        return ['code' => 200, 'message' => 'Exame excluido com sucesso!'];
    }
    public function criarComentario($medico, $comentario)
    {

        if ($medico->tipo_usuario != "medico") return ['message' => "Usuario sem permissão", "code" => 402];

        $data = [
            'exame_id' => $comentario['exame_id'],
            'usuario_id' => $medico->usuario_id,
            "comentario" => $comentario['comentario']
        ];


        $comentario = (new ComentarioExame())->AddData($data);
        $comentario = (new ComentarioExame($comentario))->getInfo();
        $medico_comentario = (new MedicoModel($comentario['usuario_id']))->getInfo();
        $usuario_info = (new UsuarioModel($comentario['usuario_id']))->getInfo();

        $retorno = [
            'comentario_exame_id'=>$comentario['comentario_exame_id'],
            'comentario'=>$comentario['comentario'],
            'data_criacao'=>$comentario['data_criacao'],
            'primeiro_nome'=> $usuario_info['primeiro_nome'],
            'ultimo_nome'=>$usuario_info['ultimo_nome'],
            'foto_medico'=>$usuario_info['imagem_perfil'],
            'crm'=>$medico_comentario['crm'],
            'estado_atuacao'=>$medico_comentario['estado_atuacao']
        ];

        return [
            "data"=>$retorno,
            'message' => 'Comentario realizado com sucesso',
            'code' => 200
        ];
    }
    public function editarComentario($medico, $comentario)
    {

        $comentarioModel = new ComentarioExame($comentario['comentario_id']);
        $datacomentario = $comentarioModel->getInfo();

        if ($datacomentario['usuario_id'] != $medico->usuario_id) {
            return ['message' => "Usuario sem permissão", "code" => 402];
        }

        $comentarioModel->editData(["comentario" => $comentario['comentario']]);

        return [
            'message' => 'Comentario editado com sucesso',
            'code' => 200
        ];
    }
    public function deletarComentario($medico, $comentario)
    {

        $comentarioModel = new ComentarioExame($comentario['comentario_id']);

        $comentario = $comentarioModel->getInfo();
        if ($comentario['usuario_id'] != $medico->usuario_id) {
            return ['message' => "Usuario sem permissão", "code" => 402];
        }


        $comentarioModel->deleteData();
        return [
            'message' => 'Comentario deletado com sucesso',
            'code' => 200
        ];
    }
}
