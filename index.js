const express = require("express");
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require("./database/Resposta");

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    }); 

const app = express();

//estou dizendo para o Express usar o EJS como View Engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/",(req,res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC'] // ASC = Crescente // DESC = Decrescente
    ]}).then((perguntas) => {
        console.log(perguntas);
        res.render("index",{
            perguntas: perguntas
        });
    });
    //SELECT * FROM perguntas
    
});

app.get("/perguntar",(req,res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req,res) =>{
    
    var titulo = req.body.titulo
    var descricao = req.body.descricao

    Pergunta.create({
       titulo: titulo,
       descricao: descricao 
    }).then(()=>{
        res.redirect("/");
    });

});

app.get("/pergunta/:id", (req,res) => {
    var id = req.params.id;
    console.log(id)
    Pergunta.findOne({
        where: {id: id}
    }).then( pergunta => {
      if(pergunta != undefined){// Pergunta encontrada
        
        Resposta.findAll({
            where:{perguntaId: pergunta.id},
            order:[
                ['id','DESC']
            ]
        }).then(respostas => {
            console.log(respostas)
            res.render('pergunta',{
                pergunta: pergunta,
                respostas:respostas
        });
        });
      }else{// Pergunta não encontrada
        res.redirect("/");
      }
    });
});

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    
    Resposta.create({
        corpo:corpo,
        perguntaId:perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId)
    });

})

//Server
app.listen("3000",()=>{
    console.log("Servidor Iniciado!");
});
