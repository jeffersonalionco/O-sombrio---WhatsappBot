

const handler = async (m, { args, usedPrefix, command, isAdmin }) => {

    try {
        const isLicense = global.db.data.users[m.sender].license.status
        const isPremium = isLicense === true ? "✅ Ativo" : "❌ Desativado";

        let pp = global.imagen11


        let str = `
✨ Bem vindo ao painel de Licenças.


*Premium:*  ${isPremium}

_- Opções de Comandos:_
 ↳ *${usedPrefix}license* - Ver Informações da licença.
 ↳ *${usedPrefix}ativar* - Ativar sua licença no bot.


Compre a sua licença e tenha acessor total aos comandos do bot.

*🏆 Acesse:* https://bit.ly/licenseSombrio 
_Libere acesso a todos os comandos._

`
   
        if (m.isGroup) {
            // await conn.sendFile(m.chat, vn, 'menu.mp3', null, m, true, { type: 'audioMessage', ptt: true})
            const fkontak = { key: { participants: "0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } }, "participant": "0@s.whatsapp.net" }
            conn.sendMessage(m.chat, { image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net') }, { quoted: fkontak });
        } else {
            //await conn.sendFile(m.chat, vn, 'menu.mp3', null, m, true, { type: 'audioMessage', ptt: true})
            const fkontak = { key: { participants: "0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } }, "participant": "0@s.whatsapp.net" }
            conn.sendMessage(m.chat, { image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net') }, { quoted: fkontak });
        }

    } catch (error) {
        console.log(error)
        m.reply(``);

    }
}


handler.command = /^(license|licenca|licence)$/i;

export default handler;