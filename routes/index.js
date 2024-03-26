const express = require('express')
const router = express.Router()


router.get('/', (req, res, next) => {
    res.send(`
        <!doctype html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            <style>
                *,*::before, *::after {
                    box-sizing: border-box; 
                    margin: 0; 
                    padding: 0;
                    font-family: "Segoe UI", sans-serif;
                }
                .container {
                    width: 100vw;
                    height: 100vh;
                    background-color: #242c2f;
                }
                .title {
                    width: 100%;
                    height: 65px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #c1a168;
                    border-bottom: 2px white solid;
                }
                .links{
                    display: flex;
                    flex-direction: column;
                    padding: 25px;
                    line-height: 45px;
                }
                a {
                    text-decoration: none;
                    color: orangered;
                    font-size: 1.2em;
                }
                a:visited {
                    color: orange;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body class="container">
            <div class="title">
                <h1>API Produtos</h1>
            </div>
            <div class="links">
                <a href="http://localhost:3000/produtos">http://localhost:3000/produtos</a>
                <a href="http://localhost:3000/estoque">http://localhost:3000/estoque</a>
                <a href="http://localhost:3000/vendas">http://localhost:3000/vendas</a>
            </div>
        </body>
        </html>
    `)
})


module.exports = router
