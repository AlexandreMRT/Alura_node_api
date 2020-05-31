const mysql = require('mysql');

const conexao = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Loldesign2019*',
  database: 'petshop',
})

module.exports = conexao;