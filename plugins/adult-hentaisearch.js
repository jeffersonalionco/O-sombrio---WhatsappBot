import cheerio from 'cheerio';
import axios from 'axios';


const handler = async (m, {conn, text, __dirname, usedPrefix, command}) => {
  
  if(global.db.data.users[m.sender].license.status === false){
    const tradution = JSON.parse(fs.readFileSync(`./language/${idioma}.json`)).plugins.verificationLicense

let license = global.db.data.users[m.sender].license
let data = new Date().toLocaleDateString('pt-BR')

let dataAtual = new Date();
dataAtual.setDate(dataAtual.getDate() + 1); // Adiciona um dia à data atual

let dataAmanha = dataAtual.toLocaleDateString('pt-BR');

handleCommand(command)

async function handleCommand(command) {
  
  // Verifica se o comando já existe em 'comandos'
  if (!license.comandosTmp[command]) {
    // Se o comando não existir, cria um novo objeto com informações padrão
    license.comandosTmp[command] = {
      tentativas: 0,
      MaxTentativas: 10,
      data: new Date().toLocaleDateString('pt-BR') // Data no formato dd/mm/aaaa
    };
    console.log(`Novo comando '${command}' criado.`);

  } else {
    console.log(`Comando '${command}' já existe.`);
    // Verificar se a data é do dia atual
    if (license.comandosTmp[command].data !== data) {
      license.comandosTmp[command].tentativas = 0
      license.comandosTmp[command].data = data
    }
    if (license.comandosTmp[command].tentativas > license.comandosTmp[command].MaxTentativas) {
      return `*Tentativa&* _${license.comandosTmp[command].MaxTentativas} de ${license.comandosTmp[command].MaxTentativas} no comando *${command}*_ \n\nCompre uma licença ou aguarde até amanha, para mais ${license.comandosTmp[command].MaxTentativas} tentativas! \n\n_Você precisa tem licença para acessar este comando_\n\nCompre a sua licença e tenha acessor total aos comandos do bot.

  *🏆 Acesse:* https://bit.ly/licenseSombrio 
  _Libere acesso a todos os comandos._`

    } else {
      license.comandosTmp[command].tentativas += 1
      m.reply(license.comandosTmp[command].tentativas)
    }
  }

  // Exibe o comando atual
  console.log(license.comandosTmp[command]);
}


if (license.comandosTmp[command].tentativas >= license.comandosTmp[command].MaxTentativas && license.comandosTmp[command].data === data) {

  if (m.isGroup) {
    return m.reply(tradution.texto2
      .replace('{{tentativas}}', license.comandosTmp[command].tentativas) 
      .replace('{{MaxTentativas}}', license.comandosTmp[command].MaxTentativas)
      .replace('{{command}}', command)
      .replace('{{data}}', data)
      .replace('{{dataAmanha}}', dataAmanha)
  );
  } else {
    return m.reply(tradution.texto3
      .replace('{{MaxTentativas}}', license.comandosTmp[command].MaxTentativas)
      .replace('{{command}}', command)
      .replace('{{tentativas}}', license.comandosTmp[command].tentativas )
  );
  }
}
}
    
  const datas = global
  const idioma = datas.db.data.users[m.sender].language
  const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`))
  const tradutor = _translate.plugins.adult_hentaisearch

  if (!global.db.data.chats[m.chat].modohorny && m.isGroup) throw `${tradutor.texto1}`;
  if (!text) throw `${tradutor.texto2}`;
  const searchResults = await searchHentai(text);
  let teks = searchResults.result.map((v, i) => `
${i+1}. *_${v.title}_*
↳ 📺 *_Vistas:_* ${v.views}
↳ 🎞️ *_Link:_* ${v.url}`).join('\n\n');
  let randomThumbnail;
  if (searchResults.result.length > 0) {
    const randomIndex = Math.floor(Math.random() * searchResults.result.length);
    randomThumbnail = searchResults.result[randomIndex].thumbnail;
  } else {
    randomThumbnail = 'https://pictures.hentai-foundry.com/e/Error-Dot/577798/Error-Dot-577798-Zero_Two.png';
    teks = tradutor.texto3;
  }
  conn.sendFile(m.chat, randomThumbnail, 'error.jpg', teks, m);
};
handler.command = /^(hentaisearch|searchhentai)$/i;
export default handler;
async function searchHentai(search) {
  return new Promise((resolve, reject) => {
    axios.get('https://hentai.tv/?s=' + search).then(async ({data}) => {
      const $ = cheerio.load(data);
      const result = {};
      const res = [];
      result.coder = 'rem-comp';
      result.result = res;
      result.warning = 'It is strictly forbidden to reupload this code, copyright © 2022 by rem-comp';
      $('div.flex > div.crsl-slde').each(function(a, b) {
        const _thumbnail = $(b).find('img').attr('src');
        const _title = $(b).find('a').text().trim();
        const _views = $(b).find('p').text().trim();
        const _url = $(b).find('a').attr('href');
        const hasil = {thumbnail: _thumbnail, title: _title, views: _views, url: _url};
        res.push(hasil);
      });
      resolve(result);
    }).catch((err) => {
      console.log(err);
    });
  });
}
