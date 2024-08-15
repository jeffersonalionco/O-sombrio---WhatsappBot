import Stripe from 'stripe';
import axios from 'axios';

// Importando as Chaves Key para funcionar 
const KEY_STRIPE = process.env.KEY_STRIPE
const KEY_BITLY = process.env.KEY_BITLY

const stripe = new Stripe(KEY_STRIPE); // Substitua com sua chave secreta


/*************************************************/
/*
/* Créditos al creador de este módulo.
/* Jefferson: https://github.com/jeffersonalionco
/* 
/*************************************************/
const handler = async (m, { args, usedPrefix, command, isAdmin }) => {

    try {
        const datas = global
        const idioma = datas.db.data.users[m.sender].language
        const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`))
        const tradutor = _translate.plugins.doar

        // Função para criar a sessão de pagamento
        async function createDonationSession(valor) {
            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'], // Métodos de pagamento aceitos
                    line_items: [{
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: 'Doação',
                            },
                            unit_amount: valor, // 1500 centavos = 15 reais
                        },
                        quantity: 1,
                    }],
                    mode: 'payment',
                    success_url: 'https://link.mercadopago.com.br/jeffersonalionco', // URL de sucesso
                    cancel_url: 'https://link.mercadopago.com.br/jeffersonalionco', // URL de cancelamento
                });

                console.log('Link de pagamento: ', session.url);
                return session.url; // Retorna a URL da sessão de pagamento

            } catch (error) {
                console.error('Erro ao criar a sessão: ', error);
                throw error; // Lança o erro para ser tratado no chamador
            }
        }






        // Substitua com seu token de acesso do Bitly
        // Busque os dados no arquivo .env no inicio do projeto
        const BITLY_ACCESS_TOKEN = KEY_BITLY;


        // Função para encurtar os URL com o bitly
        async function shortenUrl(longUrl) {
            try {
                const response = await axios.post(
                    'https://api-ssl.bitly.com/v4/shorten',
                    {
                        long_url: longUrl,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${BITLY_ACCESS_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                return response.data.link; // Retorna o link encurtado
            } catch (error) {
                console.error('Erro ao encurtar a URL:', error);
                throw error; // Lança o erro para ser tratado no chamador
            }
        }


        // Chamar a função para criar a sessão
        const URL1 = await createDonationSession(1500);
        const URLencurtada = await shortenUrl(URL1)
        const URL2 = await createDonationSession(3000);
        const URLencurtada2 = await shortenUrl(URL2)
        const URL3 = await createDonationSession(4000);
        const URLencurtada3 = await shortenUrl(URL3)


        
        const filePath = './src/doar/pix.png'
 
        // Para enviar um documento com descrição muito boa essa função.
        // conn.sendMessage(m.chat,  {document: {url: filePath}, caption: "teste"})

        conn.sendMessage(m.chat, {image: {url: filePath}, caption: ` ${tradutor.texto1[0]} ${URLencurtada}\n*R$30.00* - ${URLencurtada2}\n*R$40.00* - ${URLencurtada3}\n\n${tradutor.texto1[1]} \n\n ${tradutor.texto1[2]}`})

        //m.reply(`🤩 *Colabore,* _é com sua ajuda que este sistema continua funcionando._ \n\n🌟Deseja fazer sua doação pelo cartão de crédito:\n*R$15.00* - ${URLencurtada}\n*R$30.00* - ${URLencurtada2}\n*R$40.00* - ${URLencurtada3}\n\n_Este link foi gerado pelo bot_ Conclua sua doação no site.`)

    } catch (error) {
        console.log(error)
        m.reply('Ocorreu um erro ao processar a doação. Por favor, tente novamente mais tarde.')
    }
}

handler.command = /^(doar||donar||Donate||לִתְרוֹם||donat||ajuda)$/i;

export default handler;
