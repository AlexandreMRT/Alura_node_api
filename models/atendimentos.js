const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Atendimento {

  adiciona(atendimento, res){
    const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

    const dataValida = moment(data).isSameOrAfter(dataCriacao);

    console.log('dataCriacao :>> ', dataCriacao);

    console.log('data :>> ', data);
    
    const nomeValido = atendimento.cliente.length >= 5;

    const validacoes = [
      {
        nome: 'data',
        valido: dataValida,
        mensagem: 'Data deve ser maior ou igual data atual.'
      },
      {
        nome: 'nome',
        valido: nomeValido,
          mensagem: 'O nome do cliente deve conter no minimo 5 caracteres.'
        }
    ]

    const erros = validacoes.filter(campo => !campo.valido);

    const existemErros = erros.length;

    if(existemErros) {
      res.status(400).json(erros)
    } else {
      
      const atendimentoDatado = {...atendimento, dataCriacao, data};
      const sql = `INSERT INTO Atendimentos SET ?`

      conexao.query(sql, atendimentoDatado, (error, resultados) => {
        if(error) {
          res.status(400).json(error);
        } else {
          res.status(201).json(atendimento);
        }
      })
    }
  }

  lista(res) {

    const sql = `SELECT * FROM Atendimentos`;
    conexao.query(sql, (error, resultados) => {
      if (error) {
        res.status(400).json(error);

      } else {
        res.status(200).json(resultados);
      }
    })
  }

  buscaPorId(id, res) {
    const sql = `SELECT * FROM Atendimentos WHERE id =${id}`
    conexao.query(sql, (error, resultados) => {
      const atendimento = resultados[0];
      if(error) {
        res.status(400).json(error)
      } else {
        res.status(200).json(atendimento)
      }
    })
  }

  altera(id, valores, res) {

    if(valores.data) {
      valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
    }
    
    const sql = `UPDATE Atendimentos SET ? where id = ?`

    conexao.query(sql, [valores, id], (error, resultados) => {
      if(error) {
        res.status(400).json(error);
      } else {
        res.status(200).json({ ...valores, id });
      }
    })
  }

  deleta(id, res) {

    const sql = `DELETE FROM Atendimentos WHERE id =${id}`

    conexao.query(sql, (error, resultados) => {
      if(error) {
        res.status(400).json(error);
      } else {
        res.status(200).json({ id });
      }
    })
  }
}

module.exports = new Atendimento;