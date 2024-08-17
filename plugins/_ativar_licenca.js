import Stripe from 'stripe';
import axios from 'axios';
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path';

const KEY_GMAIL = process.env.KEY_GMAIL
const KEY_GUMROAD = process.env.KEY_GUMROAD

const handler = async (m, { args, usedPrefix, command, isAdmin }) => {

    try {
        // Substitua com sua chave API do Gumroad no arquivo .env na raiz
        const API_KEY = KEY_GUMROAD;
        const __dirname = global.__dirname()

        const dirPath = path.join(__dirname, '/src/tmplicense');

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
                let str = `🌟 *Sua licença já está ativa!* 🌟\n\n📧 *Email:* ${global.db.data.users[m.sender].license.email}\n\n📱 *Telefone:* ${global.db.data.users[m.sender].license.Telefone}\n\n🔒 *Situação:* ${situacao}\n\nObrigado por confiar no *O Sombrio WhatsApp Bot*! Se precisar de assistência, estamos à disposição.\n\n📲 Painel de licenças */license*`

                if (global.db.data.users[m.sender].license.status === true) return m.reply(str)



                // Checar se o usuario que esta mandando mensagem, ja solicitou o codigo e estamos aguardando a verificação
                const check_solicitação = fs.existsSync(dirPath + `/${m.sender}.json`)
                if (check_solicitação === true) {
                    let dadostmp = JSON.parse(fs.readFileSync(dirPath + `/${m.sender}.json`))

                    async function verifyCode(inputCode, actualCode) {
                        if (inputCode === actualCode) {
                            m.reply(`🎉 *Parabéns!* Seu código foi verificado com sucesso! ✅\n\nBem-vindo(a) ao *O Sombrio WhatsApp Bot*! Agora você tem acesso completo às funcionalidades premium. Se precisar de algo, estamos aqui para ajudar. Aproveite ao máximo!\n\n📲 Painel de licenças */license*`)
                            global.db.data.users[m.sender].license.status = true
                            global.db.data.users[m.sender].license.email = dadostmp.email


                        } else {
                            
                            // Aviso no erro
                            let Falha 
                            if(dadostmp.tentativas + 1 != 3){Falha = `[ERRO]`} else { Falha = `[ACABOU AS TENTATIVAS]`}

                            // criar opção de 2 tentativas
                             m.reply(`🚫 *Código inválido.*\n\n*Tentativas:* _${dadostmp.tentativas + 1} de 3 ${Falha}_\n\nParece que algo deu errado. Por favor, verifique o código e tente novamente. Se o problema persistir, entre em contato com nosso suporte.\n\n📲 Painel de licenças */license*`);
                             
                             // Adiciona uma nova tentativa ao arquivo temp
                             dadostmp.tentativas += 1
                             fs.writeFileSync(dirPath + `/${m.sender}.json`, JSON.stringify(dadostmp))
                             
                             if(dadostmp.tentativas === 3){
                                return fs.unlink(dirPath + `/${m.sender}.json`, (error) => {
                                    if (error) {
                                        console.log(`Houve um erro, ao deletar o arquivo temporario do ${m.sender}`)
                                    }
                                })
                             }
                        }
                    }

                    await verifyCode(args[0].toLowerCase(), dadostmp.codigo.toLowerCase());

                } else {

                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    let isEmail = regex.test(args[0]);
                    if (isEmail === false) {
                        return m.reply(`❌ *${args[0]}* não é um email válido.\n\nPara verificar sua licença, envie o comando *\`.ativar <SEU-EMAIL>\`*.\n\n💡 *Exemplo:* \`.ativar exemplo@gmail.com\`\n\n📲 Painel de licenças */license*`);
                    }

                    if(args[0] === null || args[0] === undefined)  return m.reply(`Insira o email que você informou ao comprar a licença\n\n📲 Painel de licenças */license*`)

                }








                const response = await axios.get('https://api.gumroad.com/v2/sales', {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                });


                // Verificar se o email informado possui licença 
                let isLicense = false
                for (let i = 0; i <= (response.data.sales.length - 1); i++) {
                    if (response.data.sales[i].email === args[0] /*Não pode ter gerado o arquivo*/) {
                        isLicense = true
                    }
                }



                if (isLicense === true && check_solicitação === false /*Não pode ter gerado o arquivo*/) {




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
                        to: args[0], // email do usuário que receberá o código
                        subject: 'Código de Verificação',
                        html: `
                                                <h1 style="color: #333;">Bem-vindo ao O Sombrio WhatsApp Bot!</h1>
                                                <p>Você solicitou a validação de sua licença para utilização do bot <strong>O Sombrio</strong>.</p>
                                                <p style="font-size: 16px; color: #555;">
                                                    <strong>Seu código de verificação é:</strong> 
                                                    <span style="font-size: 24px; color: #D9534F;">${verificationCode}</span>
                                                </p>
                                                <br>
                                                <p>📲 Painel de licenças: <strong>/license</strong></p>
                                                <br>
                                                <p>Para ativar sua licença, clique no link abaixo ou copie e cole no seu WhatsApp:</p>
                                                <p>
                                                    <a href="https://wa.me/5545998306644?text=!ativar%20${verificationCode}" style="color: #007BFF; text-decoration: none;">
                                                        https://wa.me/5545998306644?text=!ativar%20${verificationCode}

                                                    </a>
                                                </p>
                                                <br>
                                                <p style="color: #777;">Se você não solicitou essa validação, por favor, ignore este email.</p>
                                            
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
                        tentativas: 0,
                        status: null

                    }



                    // Gera arquivo temporario com o codigo enviado no E-mail do usuario por 30 segundo
                    fs.writeFileSync(dirPath + `/${m.sender}.json`, JSON.stringify(objeto))


                    let dadostmp = JSON.parse(fs.readFileSync(dirPath + `/${m.sender}.json`))

                    // Tempo para validação do codigo. so entra neste time se o status no arquivo temporario estiver null caso contrario vai ignorar o arquivo.
                    if (dadostmp.status === null) { // caso contrario o arquivo sera apagado...
                        m.reply(`✅ *${conn.user.name}* _- Um código de validação foi enviado para o seu e-mail._\n\n📧 *Abra seu e-mail* e clique no link para validar.\n\n🔑 Ou você pode enviar o comando *\`.ativar <SEU_CODIGO>\`* diretamente no WhatsApp.\n\n💡 *Exemplo:* \`.ativar JJVQIB\`\n\n⏳ _Este código é válido por 60 segundos._📲 Painel de licenças */license*`);



                        // Função que aguarda 60s e deleta o arquivo temporario
                        setTimeout(() => {

                            let dadostmp = JSON.parse(fs.readFileSync(dirPath + `/${m.sender}.json`))
                            dadostmp.status = true // inidica aguardadndo enviar o codigo de ativação

                            fs.writeFileSync(dirPath + `/${m.sender}.json`, JSON.stringify(dadostmp))

                            // Se o usuario ja confirmou a licença ele apenas ira retornou um log
                            if (global.db.data.users[m.sender].license.status === true) return console.log(`Licença Ativada para ${m.sender}`)
                            fs.unlink(dirPath + `/${m.sender}.json`, (error) => {
                                if (error) {
                                    console.log(`Houve um erro, ao deletar o arquivo temporario do ${m.sender}`)
                                }
                            })
                            // Se o usuario não confirmou a licença vai retornar este aviso.
                            if (global.db.data.users[m.sender].license.status === false) {
                                m.reply(`⏳ *Seu código expirou!* \n\nPor favor, envie novamente o comando para validar sua licença:\n\n🔄 *\`.ativar <Seu-Email>\`*\n\n💡 *Exemplo:* \`.ativar exemplo@gmail.com\``);

                            }

                        }, 60000)


                    }


                } else if (check_solicitação === false) {
                    m.reply(`⚠️ *Licença não encontrada para o email:* *${args[0]}*.\n\n🔍 Verifique se o email está correto ou adquira sua licença em: https://bit.ly/licenseSombrio\n\n📲 Painel de licenças */license*`)
                }




                // console.log('Compras:', response.data);
            } catch (error) {
                console.error('Erro ao buscar compras:', error);
            }
        }

        fetchSales();




    } catch (error) {
        console.log(error)
        m.reply(`❌ *Erro ao executar a ativação da licença.*\n\nPor favor, entre em contato para suporte: https://wa.me/5545998331383, se não comprou sua licença, entre no site https://bit.ly/licenseSombrio \n\n📲 Painel de licenças */license*`);

    }
}


handler.command = /^(ativar|verificar)$/i;

export default handler;