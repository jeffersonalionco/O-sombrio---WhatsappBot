import fetch from 'node-fetch';
import PDFDocument from 'pdfkit';
import {extractImageThumb} from '@whiskeysockets/baileys';

const handler = async (m, {conn, text, usedPrefix, command, args}) => {
  
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
      MaxTentativas: 8,
      data: new Date().toLocaleDateString('pt-BR') // Data no formato dd/mm/aaaa
    };
    console.log(`Novo comando '${command}' criado.`);

  } else {
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
  const tradutor = _translate.plugins.adult_hentaipdf

  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw tradutor.texto1;
  if (!text) throw `${tradutor.texto2} ${usedPrefix + command} ${tradutor.texto2_1}`;
  try {
    m.reply(global.wait);
    const res = await fetch(`https://api.lolhuman.xyz/api/nhentaisearch?apikey=${lolkeysapi}&query=${text}`);
    const json = await res.json();
    const aa = json.result[0].id;
    const data = await nhentaiScraper(aa);
    const pages = [];
    const thumb = `https://external-content.duckduckgo.com/iu/?u=https://t.nhentai.net/galleries/${data.media_id}/thumb.jpg`;
    data.images.pages.map((v, i) => {
      const ext = new URL(v.t).pathname.split('.')[1];
      pages.push(`https://external-content.duckduckgo.com/iu/?u=https://i7.nhentai.net/galleries/${data.media_id}/${i + 1}.${ext}`);
    });
    const buffer = await (await fetch(thumb)).buffer();
    const jpegThumbnail = await extractImageThumb(buffer);
    const imagepdf = await toPDF(pages);
    await conn.sendMessage(m.chat, {document: imagepdf, jpegThumbnail, fileName: data.title.english + '.pdf', mimetype: 'application/pdf'}, {quoted: m});
  } catch {
    throw `${tradutor.texto3}`;
  }
};
handler.command = /^(hentaipdf)$/i;
export default handler;
async function nhentaiScraper(id) {
  const uri = id ? `https://cin.guru/v/${+id}/` : 'https://cin.guru/';
  const html = (await axios.get(uri)).data;
  return JSON.parse(html.split('<script id="__NEXT_DATA__" type="application/json">')[1].split('</script>')[0]).props.pageProps.data;
}
function toPDF(images, opt = {}) {
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(images)) images = [images];
    const buffs = []; const doc = new PDFDocument({margin: 0, size: 'A4'});
    for (let x = 0; x < images.length; x++) {
      if (/.webp|.gif/.test(images[x])) continue;
      const data = (await axios.get(images[x], {responseType: 'arraybuffer', ...opt})).data;
      doc.image(data, 0, 0, {fit: [595.28, 841.89], align: 'center', valign: 'center'});
      if (images.length != x + 1) doc.addPage();
    }
    doc.on('data', (chunk) => buffs.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffs)));
    doc.on('error', (err) => reject(err));
    doc.end();
  });
}


/* import fetch from 'node-fetch'
let handler = async (m, { conn, text, usedPrefix, command, args }) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw '*[❗𝐈𝐍𝐅𝐎❗] 𝙻𝙾𝚂 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 +𝟷𝟾 𝙴𝚂𝚃𝙰𝙽 𝙳𝙴𝚂𝙰𝙲𝚃𝙸𝚅𝙰𝙳𝙾𝚂 𝙴𝙽 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙾, 𝚂𝙸 𝙴𝚂 𝙰𝙳𝙼𝙸𝙽 𝚈 𝙳𝙴𝚂𝙴𝙰 𝙰𝙲𝚃𝙸𝚅𝙰𝚁𝙻𝙾𝚂 𝚄𝚂𝙴 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 #enable modohorny*'
if (!text) throw `*[❗] 𝙸𝙽𝙶𝚁𝙴𝚂𝙰 𝙴𝙻 𝙽𝙾𝙼𝙱𝚁𝙴 𝙳𝙴 𝙰𝙻𝙶𝚄𝙽𝙰 𝙲𝙰𝚃𝙴𝙶𝙾𝚁𝙸𝙰 𝙳𝙴 𝙷𝙴𝙽𝚃𝙰𝙸, 𝙴𝙹𝙴𝙼𝙿𝙻𝙾: ${usedPrefix + command} miku*`
try {
m.reply(global.wait)
let res = await fetch(`https://api.lolhuman.xyz/api/nhentaisearch?apikey=${lolkeysapi}&query=${text}`)
let json = await res.json()
let aa = json.result[0].id
let aa2 = json.result[0].title_native
let res2 = await fetch(`https://api.lolhuman.xyz/api/nhentaipdf/${aa}?apikey=${lolkeysapi}`)
let json2 = await res2.json()
let aa3 = json2.result
await conn.sendMessage(m.chat, { document: { url: aa3 }, mimetype: 'application/pdf', fileName: `${aa2}.pdf` }, { quoted: m })
} catch {
throw `*[❗] 𝙴𝚁𝚁𝙾𝚁, 𝚅𝚄𝙴𝙻𝚅𝙰 𝙰 𝙸𝙽𝚃𝙴𝙽𝚃𝙰𝚁𝙻𝙾 𝚈/𝙾 𝙿𝚁𝚄𝙴𝙱𝙴 𝙲𝙾𝙽 𝙾𝚃𝚁𝙰 𝙲𝙰𝚃𝙴𝙶𝙾𝚁𝙸𝙰*`
}}
handler.command = /^(hentaipdf)$/i
export default handler*/
