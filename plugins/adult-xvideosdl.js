import fetch from 'node-fetch';
import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { conn, args, command, usedPrefix, text }) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language
  const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`))
  const tradutor = _translate.plugins.adult_xvideosdl

  
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
      MaxTentativas: 6,
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

  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${tradutor.texto1} #enable modohorny*`;
  if (!args[0]) throw `${tradutor.texto2} ${usedPrefix + command} https://www.xvideos.com/video70389849/pequena_zorra_follada_duro*`;
  try {
    conn.reply(m.chat, `${tradutor.texto3}`, m);
    const res = await xvideosdl(args[0]);
    conn.sendMessage(m.chat, { document: { url: res.result.url }, mimetype: 'video/mp4', fileName: res.result.title }, { quoted: m });
  } catch (e) {
    throw `${tradutor.texto4}\n*◉ https://www.xvideos.com/video70389849/pequena_zorra_follada_duro*`;
  }
};
handler.command = /^(xvideosdl)$/i;
export default handler;

async function xvideosdl(url) {
  return new Promise((resolve, reject) => {
    fetch(`${url}`, { method: 'get' })
      .then(res => res.text())
      .then(res => {
        let $ = cheerio.load(res, { xmlMode: false });
        const title = $("meta[property='og:title']").attr("content")
        const keyword = $("meta[name='keywords']").attr("content")
        const views = $("div#video-tabs > div > div > div > div > strong.mobile-hide").text() + " views"
        const vote = $("div.rate-infos > span.rating-total-txt").text()
        const likes = $("span.rating-good-nbr").text()
        const deslikes = $("span.rating-bad-nbr").text()
        const thumb = $("meta[property='og:image']").attr("content")
        const url = $("#html5video > #html5video_base > div > a").attr("href")
        resolve({ status: 200, result: { title, url, keyword, views, vote, likes, deslikes, thumb } })
      })
  })
};

async function xvideosSearch(url) {
  return new Promise(async (resolve) => {
    await axios.request(`https://www.xvideos.com/?k=${url}&p=${Math.floor(Math.random() * 9) + 1}`, { method: "get" }).then(async result => {
      let $ = cheerio.load(result.data, { xmlMod3: false });
      let title = [];
      let duration = [];
      let quality = [];
      let url = [];
      let thumb = [];
      let hasil = [];

      $("div.mozaique > div > div.thumb-under > p.title").each(function (a, b) {
        title.push($(this).find("a").attr("title"));
        duration.push($(this).find("span.duration").text());
        url.push("https://www.xvideos.com" + $(this).find("a").attr("href"));
      });
      $("div.mozaique > div > div.thumb-under").each(function (a, b) {
        quality.push($(this).find("span.video-hd-mark").text());
      });
      $("div.mozaique > div > div > div.thumb > a").each(function (a, b) {
        thumb.push($(this).find("img").attr("data-src"));
      });
      for (let i = 0; i < title.length; i++) {
        hasil.push({
          title: title[i],
          duration: duration[i],
          quality: quality[i],
          thumb: thumb[i],
          url: url[i]
        });
      }
      resolve(hasil);
    });
  });
};
