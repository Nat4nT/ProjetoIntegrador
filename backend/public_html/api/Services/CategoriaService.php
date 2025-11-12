<?php

namespace Api\Services;

use Api\Models\CategoriaModel;

class CategoriaService
{
    public function getCategorias($dadosUsuario)
    {
        $categoriaModel = new CategoriaModel();
        $filtros =  [
            'where' => "{$categoriaModel->column_reference} = {$dadosUsuario->usuario_id} OR sis_cat = 1",
        ];

        $categorias = $categoriaModel->getData($filtros);

        return [
            "message" => "Categorias Registradas",
            "data" => $categorias,
            'code' => 200
        ];
    }



    private function validarCamposCategoria($dados)
    {
        $erro = 0;
        $mensagem = [];

        if (!isset($dados['nome']) || is_null($dados['nome'])) {
            $erro = 1;
            $mensagem['nome'] = "Campo nome invalido";
        }

        return [
            'erro' => $erro,
            'mensagem' => $mensagem
        ];
    }
    public function prepareCategoriaData($dados, $usuario_id)
    {

        $validacao = $this->validarCamposCategoria($dados);
        if ($validacao['erro']) {
            return ["message" => $validacao['mensagem'], 'error' => 1];
        }

        return [
            'usuario_id' => $usuario_id,
            'nome' => $dados['nome'],
        ];
    }

    public function addCategoria($dadosUsuario, $dadosFormulario)
    {
        $categoriaModel = new CategoriaModel();
        $retonro_erro = [];

        if (empty($dadosFormulario)) {
            return ['code' => 401, 'message' => "Dados Inválidos"];
        }

        $dadosCategoria = $this->prepareCategoriaData($dadosFormulario, $dadosUsuario->usuario_id);

        if (isset($dadosCategoria['error'])) {
            $retonro_erro[] = ['code' => 400, 'message' => $dadosCategoria['message']];
        }

        if (!empty($retonro_erro)) {
            return ['code' => 400, 'message' => json_encode($retonro_erro)];
        }
        (new CategoriaModel())->AddData($dadosCategoria);
        return ['code' => 200, 'message' => 'Categoria registrada com sucesso'];
    }

    public function deletarCategoria($categoria_id)
    {
        $response = (new CategoriaModel($categoria_id))->deleteData();
        if ($response) {
            return [
                "message" => 'Cartegoria deletada com sucesso',
                'code' => 200
            ];
        } else {
            return [
                "message" => 'Erro ao deletar categoria',
                'code' => 300
            ];
        }
    }
}
