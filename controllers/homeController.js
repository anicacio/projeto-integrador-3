const path = require('path')
const fs = require('fs')
const Sequelize = require('sequelize')

const {
    Usuario,
    Endereco,
    Estado,
    Cidade,
    Pedido,
    Produto,
    Categoria,
    ImagemProduto,
    Pet,
    Carrinho
} = require("../models");

const Op = Sequelize.Op



const homeController =  {
    home: async (req, res) =>  {
        let carrinho = undefined
        let usuario = req.session.usuario
        
        //Buscando todos itens
        let itens = await Produto.findAll({
            include: [{
                model: ImagemProduto,
                as: "imagem",
                atributes: ["imagem"]
            }]
        });

        let pets = await Pet.findAll({
            where: {
                adotado: 0
            },
            order: [
                ['dataCadastro', 'DESC'],
            ],
            include: ['imagem'],
            limit: 18
        });

        let adotados = await Pet.findAll({
            where: {
                adotado: 1
            },
            order: [
                ['dataAdotado', 'DESC'],
            ],
            include: ['imagem'],
            limit: 18
        });

        let maisVendidos = itens.sort((a,b) => {
            if(a.numero_vendas > b.numero_vendas) return -1;
            if(a.numero_vendas < b.numero_vendas) return 1;
            return 0;
        })
        
        if(usuario){
            carrinho = await Carrinho.findAll({
                where:{
                    usuario_id:usuario.id, 
                    ativo: 1
                }})
            }
            
        
        
         


        res.render(
            'home', {
                title: 'Home',
                css: 'index',
                usuario,
                maisVendidos,
                pets,
                adotados,
                carrinho
            }
        );
    },
    pesquisa: async (req, res) => {
        let usuario = req.session.usuario;
        let pesquisa = req.query.search
        let carrinho = undefined

        let resultadoPesquisa = await Produto.findAll({where:{nome: {[Op.like]:`%${pesquisa}%`}}, include: ['imagem']})
        if(usuario){
            carrinho = await Carrinho.findAll({
                where:{
                    usuario_id:usuario.id, 
                    ativo: 1
                }})
            }
        
        console.log(resultadoPesquisa)
        res.render('pesquisa',{
            title:'Resultado da Pesquisa',
            css:'categoria',
            usuario,
            pesquisa,
            resultadoPesquisa,
            carrinho
            
        })
    }

}

module.exports = homeController