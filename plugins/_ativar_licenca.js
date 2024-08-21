import Stripe from 'stripe';
import axios from 'axios';
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path';
import { stringify } from 'querystring';
import { trace } from 'console';

const KEY_GMAIL = process.env.KEY_GMAIL
const KEY_GUMROAD = process.env.KEY_GUMROAD

const handler = async (m, { args, usedPrefix, command, isAdmin }) => {

    try {
        const idioma = global.db.data.users[m.sender].language
        const tradutor = JSON.parse(fs.readFileSync(`./language/${idioma}.json`)).plugins.ativar_licenca
        // Substitua com sua chave API do Gumroad no arquivo .env na raiz
        const API_KEY = KEY_GUMROAD;
        const __dirname = global.__dirname()

        const dirPath = path.join(__dirname, '/src/tmplicense');

        const filePath = "./src/licenca/emailAtivos.json";
        // Verifica se o arquivo existe
        if (!fs.existsSync(filePath)) {
            // Se o arquivo não existir, cria o arquivo com o formato []
            fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
        }

        // Agora lê o conteúdo do arquivo
        let emailAtivosJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));



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
                let str = tradutor.texto1
                    .replace("{{Email}}", global.db.data.users[m.sender].license.email)
                    .replace("{{Telefone}}", global.db.data.users[m.sender].license.Telefone)
                    .replace("{{Situacao}}", situacao)

                if (global.db.data.users[m.sender].license.status === true) return m.reply(str)



                // Checar se o usuario que esta mandando mensagem, ja solicitou o codigo e estamos aguardando a verificação
                const check_solicitação = fs.existsSync(dirPath + `/${m.sender}.json`)
                if (check_solicitação === true) {
                    let dadostmp = JSON.parse(fs.readFileSync(dirPath + `/${m.sender}.json`))

                    async function verifyCode(inputCode, actualCode) {
                        if (inputCode === actualCode) {

                            m.reply(tradutor.texto2)
                            global.db.data.users[m.sender].license.status = true
                            global.db.data.users[m.sender].license.email = dadostmp.email
                            emailAtivosJson.push(dadostmp.email)

                            fs.writeFileSync("./src/licenca/emailAtivos.json", JSON.stringify(emailAtivosJson))


                        } else {

                            // Aviso no erro
                            let Falha
                            if (dadostmp.tentativas + 1 != 3) { Falha = `[ERRO]` } else { Falha = `[ACABOU AS TENTATIVAS]` }

                            // criar opção de 2 tentativas
                            m.reply(tradutor.texto3
                                .replace("{{tentativa}}", dadostmp.tentativas + 1)
                                .replace("{{falha}}", Falha)
                            );

                            // Adiciona uma nova tentativa ao arquivo temp
                            dadostmp.tentativas += 1
                            fs.writeFileSync(dirPath + `/${m.sender}.json`, JSON.stringify(dadostmp))

                            if (dadostmp.tentativas === 3) {
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
                    let isEmail = regex.test(args[0].toLowerCase());

                    if (isEmail === false) {
                        return m.reply(tradutor.texto4
                        .replace("{{email}}", args[0].toLowerCase())
                    );
                    }

                    if (args[0].toLowerCase() === null || args[0].toLowerCase() === undefined) return m.reply(tradutor.texto5)

                }








                const response = await axios.get('https://api.gumroad.com/v2/sales', {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                });


                // Verificar se o email informado possui licença 
                let isLicense = false
                for (let i = 0; i <= (response.data.sales.length - 1); i++) {
                    if (response.data.sales[i].email === args[0].toLowerCase() /*Não pode ter gerado o arquivo*/) {
                        isLicense = true
                    }
                }



                if (isLicense === true && check_solicitação === false /*Não pode ter gerado o arquivo*/) {

                    if (emailAtivosJson.includes(args[0].toLowerCase())) {
                        return m.reply(tradutor.texto6
                    .replace("{{email}}", args[0].toLowerCase()))
                    }




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
                    let urlVerification = `https://wa.me/5545998306644?text=!ativar%20${verificationCode}`
                    let mailOptions = {
                        from: 'jeffersonalionco@gmail.com',
                        to: args[0].toLowerCase(), // email do usuário que receberá o código
                        subject: 'Código de Verificação',
                        html: tradutor.texto7
                        .replace("{{codigoVerificacao}}", verificationCode)
                        .replace("{{urlVerification}}", urlVerification)
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
                        email: args[0].toLowerCase(),
                        tentativas: 0,
                        status: null

                    }



                    // Gera arquivo temporario com o codigo enviado no E-mail do usuario por 30 segundo
                    fs.writeFileSync(dirPath + `/${m.sender}.json`, JSON.stringify(objeto))


                    let dadostmp = JSON.parse(fs.readFileSync(dirPath + `/${m.sender}.json`))

                    // Tempo para validação do codigo. so entra neste time se o status no arquivo temporario estiver null caso contrario vai ignorar o arquivo.
                    if (dadostmp.status === null) { // caso contrario o arquivo sera apagado...
                        m.reply(tradutor.texto8.replace("{{nome}}", conn.user.name));



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
                                m.reply(tradutor.texto9);

                            }

                        }, 60000)


                    }


                } else if (check_solicitação === false) {
                    m.reply(tradutor.texto10.replace("{{argumento}}", args[0].toLowerCase()))
                }




                // console.log('Compras:', response.data);
            } catch (error) {
                console.error('Erro ao buscar compras:', error);
            }
        }

        fetchSales();




    } catch (error) {
        console.log(error)
        m.reply(tradutor.texto11);

    }
}


handler.command = /^(ativar|verificar)$/i;

export default handler;