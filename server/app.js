var express = require('express'),
    fs = require('fs'),
    _ = require('underscore'),
    app = express();

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))

var db = {
  jogadores: JSON.parse(fs.readFileSync(__dirname + '/data/jogadores.json')),
  jogosPorJogador: JSON.parse(fs.readFileSync(__dirname + '/data/jogosPorJogador.json'))
};


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');
app.set('views', 'server/views');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json

app.get('/', function(req, res){
  res.render('index.hbs',db.jogadores);
});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código

app.get('/jogador/:steamid/', function(req, res){
  var perfil = _.find(db.jogadores.players, function(esse) { return esse.steamid === req.params.id; });
  var jogos = db.jogosPorJogador[req.params.id];

  jogos.num_nao_jogados = _.where(jogos.games, { playtime_forever: 0 }).length;

  jogos.games = _.sortBy(jogos.games, function(esse) {
    return -esse.playtime_forever;
  });

  jogos.games = _.map(jogos.games, function(esse){
    esse.playtime_forever = esse.playtime_forever/60;
  })
  res.render('jogador', {
    profile: perfil,
    gameInfo: jogos,
    favorite: jogos.games[0]
  });
});

app.use(express.static('client'));

var server = app.listen(app.get('port'), function () {
  console.log('Servidor aberto em http://localhost:' + server.address().port);

});

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código

app.use(express.static('client'))
// abrir servidor na porta 3000
// dica: 1-3 linhas de código
app.listen(3000)
