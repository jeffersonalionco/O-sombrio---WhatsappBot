import fetch from 'node-fetch';

const handler = async (m, {text, usedPrefix, command}) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language
  const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`))
  const tradutor = _translate.plugins.adult_xnxxsearch

  
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


if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${tradutor.texto1} ${usedPrefix}enable modohorny*`;   
  if (!text) throw `${tradutor.texto2} ${usedPrefix + command} Con mi prima*`;
  try {
    const vids_ = {
      from: m.sender,
      urls: [],
    };
    if (!global.videoListXXX) {
      global.videoListXXX = [];
    }
    if (global.videoListXXX[0]?.from == m.sender) {
      global.videoListXXX.splice(0, global.videoListXXX.length);
    }
    const res = await xnxxsearch(text);
    const json = res.result;
    let cap = `${tradutor.texto3} ${text.toUpperCase()}\n\n`;
    let count = 1;
    for (const v of json) {
      const linkXXX = v.link;
      vids_.urls.push(linkXXX);
      cap += `*[${count}]*\n• *🎬 Titulo:* ${v.title}\n• *🔗 Link:* ${v.link}\n• *❗ Info:* ${v.info}`;
      cap += '\n\n' + '••••••••••••••••••••••••••••••••' + '\n\n';
      count++;
    }
    m.reply(cap);
    global.videoListXXX.push(vids_);
  } catch {
    throw e;
  }
};
handler.help = ['xnxxsearch'].map((v) => v + ' <query>');
handler.tags = ['downloader', 'premium'];
handler.command = /^xnxxsearch|xnxxs$/i;
export default handler;

async function xnxxsearch(query) {
  return new Promise((resolve, reject) => {
    const baseurl = 'https://www.xnxx.com';
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {method: 'get'}).then((res) => res.text()).then((res) => {
      const $ = cheerio.load(res, {xmlMode: false});
      const title = [];
      const url = [];
      const desc = [];
      const results = [];
      $('div.mozaique').each(function(a, b) {
        $(b).find('div.thumb').each(function(c, d) {
          url.push(baseurl + $(d).find('a').attr('href').replace('/THUMBNUM/', '/'));
        });
      });
      $('div.mozaique').each(function(a, b) {
        $(b).find('div.thumb-under').each(function(c, d) {
          desc.push($(d).find('p.metadata').text());
          $(d).find('a').each(function(e, f) {
            title.push($(f).attr('title'));
          });
        });
      });
      for (let i = 0; i < title.length; i++) {
        results.push({title: title[i], info: desc[i], link: url[i]});
      }
      resolve({code: 200, status: true, result: results});
    }).catch((err) => reject({code: 503, status: false, result: err}));
  });
}


