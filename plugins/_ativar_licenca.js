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

        // Função de consulta ao gumroad 
        async function fetchSales() {
            try {

               
                    let situacao
                    console.log(global.db.data.users[m.sender].license.status)
                    if (global.db.data.users[m.sender].license.status === true) {
                        situacao = 'Ativo'
                    } else {
                        situacao = 'Inativo'
                    }
                    let str = `*Sua licença ja esta ativa.*\n\nEmail: ${global.db.data.users[m.sender].license.email}\n\Telefone: ${global.db.data.users[m.sender].license.Telefone}\nSituação: ${situacao}`
                    if (global.db.data.users[m.sender].license.status === true) return m.reply(str)



                // Checar se o usuario que esta mandando mensagem, ja solicitou o codigo e estamos aguardando a verificação
                const check_solicitação = fs.existsSync(__dirname + `/src/tmplicense/${m.sender}.json`)
                if (check_solicitação === true) {
                    let dadostmp = JSON.parse(fs.readFileSync(__dirname + `/src/tmplicense/${m.sender}.json`))

                    async function verifyCode(inputCode, actualCode) {
                        if (inputCode === actualCode) {
                            console.log('Código verificado com sucesso!');
                            global.db.data.users[m.sender].license.status = true
                            global.db.data.users[m.sender].license.email = dadostmp.email


                        } else {
                            console.log('Código inválido. Por favor, tente novamente.');
                            return m.reply('Código inválido. Por favor, tente novamente.')
                        }
                    }

                    await verifyCode(args[0].toLowerCase(), dadostmp.codigo.toLowerCase());

                } else {

                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    let isEmail = regex.test(args[0]);
                    if (isEmail === false) { return m.reply(`*${args[0]}*, não é um email valido. \n\nPara verificar sua licença, envie *.ativar <SEU-EMAIL>*\n\n> Exemplo: .ativar exeemplo@gmail.com`) }
                }



                




                const response = await axios.get('https://api.gumroad.com/v2/sales', {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                });


                // Verificar se o email informado possui licença 
                for (let i = 0; i <= (response.data.sales.length - 1); i++) {

                    if (response.data.sales[i].email === args[0] && check_solicitação === false /*Não pode ter gerado o arquivo*/) {




                        // Gerando o codigo de verificação
                        function generateVerificationCode() {
                            const codeLength = 6;
                            return Math.random().toString(36).substring(2, 2 + codeLength).toUpperCase();
                        }

                        const verificationCode = generateVerificationCode();
                        console.log(verificationCode); // Exemplo: "A1B2C3"

                        
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
                                                    html: `
                                                    <h1 style="color: #333;">Bem-vindo ao O Sombrio WhatsApp Bot!</h1>
                                                    <p>Você solicitou a validação de sua licença para utilização do bot <strong>O Sombrio</strong>.</p>
                                                    <p style="font-size: 16px; color: #555;">
                                                        <strong>Seu código de verificação é:</strong> 
                                                        <span style="font-size: 24px; color: #D9534F;">${verificationCode}</span>
                                                    </p>
                                                    <p>Para ativar sua licença, clique no link abaixo ou copie e cole no seu WhatsApp:</p>
                                                    <p>
                                                        <a href="https://wa.me/5545998306644?text=!ativar%20${verificationCode}" style="color: #007BFF; text-decoration: none;">
                                                            https://wa.me/5545998306644?text=!ativar%20${verificationCode}
                                                        </a>
                                                    </p>
                                                    <br>
                                                    <p style="color: #777;">Se você não solicitou essa validação, por favor, ignore este email.</p>
                                                    <p style="color: #777;">Atenciosamente,<br><strong>Equipe O Sombrio</strong></p>
                                                `
                                                };
                        
                                                // Envia o email
                                                transporter.sendMail(mailOptions, (error, info) => {
                                                    if (error) {
                                                        return console.log(error);
                                                    }
                                                    console.log('Email enviado: ' + info.response);
                                                });
                        
                        
                        let objeto = {
                            id: m.sender,
                            nome: conn.user.name,
                            codigo: verificationCode,
                            email: args[0],
                            status: null

                        }



                        // Gera arquivo temporario com o codigo enviado no E-mail do usuario por 30 segundo
                        fs.writeFileSync(__dirname + `/src/tmplicense/${m.sender}.json`, JSON.stringify(objeto))

                        
                        let dadostmp = JSON.parse(fs.readFileSync(__dirname + `/src/tmplicense/${m.sender}.json`))
                        // Tempo para validação do codigo.
                        if (dadostmp.status === null) { // caso contrario o arquivo sera apagado...
                            m.reply(`*${conn.user.name}* _- foi enviado um codigo de validação no seu e-mail._ \n\n Abra seu e-mail e Clique no link, para validar.\n\n Ou você pode enviar o comando *.ativar <SEU_CODIGO>*  \n\n> Exemplo: *.ativar JJVQIB* \n\n _ESTE CODIGO É VALIDO POR 60s_`)
                            
                            
                            
                            setTimeout(() => {
                                let dadostmp = JSON.parse(fs.readFileSync(__dirname + `/src/tmplicense/${m.sender}.json`))
                                dadostmp.status = true // inidica aguardadndo.
                                fs.writeFileSync(__dirname + `/src/tmplicense/${m.sender}.json`, JSON.stringify(dadostmp))

                                // Se o usuario ja confirmou a licença ele apenas ira retornou um log
                                if (global.db.data.users[m.sender].license.status === true) return console.log(`Licença Ativada para ${m.sender}`)
                                fs.unlink(__dirname + `/src/tmplicense/${m.sender}.json`, (error) => {
                                    if (error) {
                                        console.log(`Houve um erro, ao deletar o arquivo temporario do ${m.sender}`)
                                    }
                                })
                                // Se o usuario não confirmou a licença vai retornar este aviso.
                                if (global.db.data.users[m.sender].license.status === false) {
                                    m.reply("Seu Codigo Expirou! Para validar sua licença, envie novamente o comando, \n\n*.ativar <Seu-Email>* ")
                                }

                            }, 60000)


                        }

                        // ---------- --------------  Verificar Codigo -----------------------

                        function verifyCode(inputCode, actualCode) {
                            if (inputCode === actualCode) {
                                console.log('Código verificado com sucesso!');
                            } else {
                                console.log('Código inválido. Por favor, tente novamente.');
                            }
                        }

                        // Suponha que o usuário inseriu um código
                        const userInputCode = 'A1B2C3'; // Esse seria o código que o usuário inseriu

                        verifyCode(userInputCode, verificationCode);







                    } else if( check_solicitação === false){
                        m.reply(`O email *${args[0]}* não possui licença! Certifique que seu email esta correto ou compre sua licença em https://jeffersonion.gumroad.com/l/sgfuvi `)
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