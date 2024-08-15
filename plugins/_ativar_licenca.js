import Stripe from 'stripe';
import axios from 'axios';
import nodemailer from 'nodemailer'
import fs from 'fs'
const KEY_GMAIL = process.env.KEY_GMAIL
const KEY_GUMROAD = process.env.KEY_GUMROAD

const handler = async (m, { args, usedPrefix, command, isAdmin }) => {

    try {
        // Substitua com sua chave API do Gumroad no arquivo .env na raiz
        const API_KEY = KEY_GUMROAD;
        const __dirname = global.__dirname()

        m.reply(__dirname)



        // Função de consulta ao gumroad 
        async function fetchSales() {
            try {
                const response = await axios.get('https://api.gumroad.com/v2/sales', {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                });


                // Verificar se o email informado possui licença 
                for (let i = 0; i <= (response.data.sales.length - 1); i++) {

                    if (response.data.sales[i].email === 'jeffersonalionco@gmail.com') {
                        console.log('Sua licença esta ativa.')



                        // Gerando o codigo de verificação
                        function generateVerificationCode() {
                            const codeLength = 6;
                            return Math.random().toString(36).substring(2, 2 + codeLength).toUpperCase();
                        }

                        const verificationCode = generateVerificationCode();
                        console.log(verificationCode); // Exemplo: "A1B2C3"

/*
                        // Configura o transporte para envio de email
                        let transporter = nodemailer.createTransport({
                            service: 'gmail', // ou outro serviço de email
                            auth: {
                                user: 'jeffersonalionco@gmail.com', // seu email
                                pass: KEY_GMAIL // sua senha de email
                            }
                        });

                        // Opções de email
                        let mailOptions = {
                            from: 'jeffersonalionco@gmail.com',
                            to: 'jeffersonalionco@gmail.com', // email do usuário que receberá o código
                            subject: 'Código de Verificação',
                            text: `Seu código de verificação é: ${verificationCode} \n\n https://wa.me/5545998306644?text=.`
                        };

                        // Envia o email
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Email enviado: ' + info.response);
                        });


*/                      
                    let objeto = {
                        id: conn.user.jid,
                        nome: conn.user.name,
                        codigo: verificationCode,
                        email: args[0]

                    }

                    fs.writeFileSync(__dirname + `/src/tmplicense/${conn.user.jid}.json`, JSON.stringify(objeto))

                // ---------- --------------  Verificar Codigo -----------------------
                
                        function verifyCode(inputCode, actualCode) {
                            if(inputCode === actualCode) {
                                console.log('Código verificado com sucesso!');
                            } else {
                                console.log('Código inválido. Por favor, tente novamente.');
                            }
                        }
                        
                        // Suponha que o usuário inseriu um código
                        const userInputCode = 'A1B2C3'; // Esse seria o código que o usuário inseriu
                        
                        verifyCode(userInputCode, verificationCode);
                        






                    } else {
                        console.log('Não possui licença')
                    }
                }

               // console.log('Compras:', response.data);
            } catch (error) {
                console.error('Erro ao buscar compras:', error);
            }
        }

        fetchSales();




    } catch (error) {
        console.log(error)
        m.reply('Ocorreu um erro ao processar a doação. Por favor, tente novamente mais tarde.')
    }
}


handler.command = /^(ativar)$/i;

export default handler;