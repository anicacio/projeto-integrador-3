const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const fileHelper = require('../middlewares/fileHelper')
const { Usuario } = require('../models');



const authController = {
    login: (req, res) => {

    },

    cadastro: async (req, res) => {
        let {nome, cpf_cnpj, email, senha} = req.body;
    
        if(req.file){            
            var imagem = await fileHelper.compressImage(req.file, 100)
                .then()
                .catch(err => console.log(err));
        }

        const user = await Usuario.findOne({where: {email}});

        if(user) {
            res.redirect('/login?erro=1')
        }

        let senhaHash = bcrypt.hashSync(senha, 12);

        let  novoUsuario = {
            nome,
            email,
            senha: senhaHash,
            cpf_cnpj,
            imagem
        }
                
        await Usuario.create(novoUsuario)
            .then()
            .catch(err => console.log(err));
        

        res.render('login', {
            title: 'Tela de Login',
            error: false
        });
    },

    showLogin: (req, res) => {
        res.render('login', {
            title: 'Tela de Login',
            css: 'login',
            error: false
        });
    },

    showCadastro: (req, res) => {
        res.render('cadastro', {
            title: 'Tela de Cadastro',
            css: 'cadastro',
            error: false
        });
    }
};

module.exports = authController;