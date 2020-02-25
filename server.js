    const express = require("express"); //fazendo com que o node pegue o express e atribua à const express
    const server = express(); // a const server recebe a função express

    //configurar o servidor para apresentar arquivos estáticos
    //pedindo ao express que os arquivos estáticos
    //fiquem na pasta 'public'
    server.use(express.static('public'));


    //HABILITAR O CORPO DO FORMULÁRIO
    server.use(express.urlencoded({extended: true}));

    //CONFIGURAR A CONEXÃO COM O BANCO DE DADOS
    const Pool = require('pg').Pool; //O Pool vai manter a conexão ativa sem precisar ficar conectando
    const db = new Pool({
        user: 'postgres',
        password: 'plss34ef',
        host: 'localhost',
        port: 5432,
        database:'doe'
    })


    //configurando a template engine
    // configurando na raíz do projeto
    //aplicando o server dentro do express
    const nunjucks = require("nunjucks");
    nunjucks.configure("./",{
        express: server,
        noCache:true,
    }); 
        
  

    //CONFIGURANDO A APRESENTAÇÃO DA PÁGINA
    //passando o caminho / e uma outra função 
    //req são requisições... pedidos
    //res são respostas
    server.get("/", function(req, res){ 
        
        db.query("SELECT * FROM donors", function(err, result){
            if (err) return res.send("Erro no banco de dados.")
            
            const donors = result.rows;
             
            return res.render("index.html", { donors });// renderizando a página
        })

    });

    //PEGAR DADOS DO FORMULÁRIO
    server.post("/", function(req, res){
        const name = req.body.name
        const email = req.body.email
        const blood = req.body.blood 

        //se o nome for vazio, se o email for vazio, se o blood for vazio
        if(name == "" || email == "" || blood == ""){
            return res.send("Todos os campos são obrigatórios!")

        }

        //COLOCA VALORES DENTRO DO BD
        const query = `INSERT INTO donors ("name", "email", "blood") 
                       VALUES ($1, $2, $3)`

        const values = [name, email, blood];

        db.query(query, values, function(err){

            //fluxo de erro
            if (err) return res.send("Erro no banco de dados.")
            //fluxo ideal
            return res.redirect("/")//redirecionando para a página inicial
            
        });

        
    })

    //LIGAR O SERVIDOR E PERMITIR O ACESSO NA PORTA 3000    
    server.listen(3000, function(){
        console.log("Servidor inicializado")
    });