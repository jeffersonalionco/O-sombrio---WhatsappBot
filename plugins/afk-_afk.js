



export function before(m) {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language
  const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`))
  const tradutor = _translate.plugins.afk__afk

  
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


  const user = global.db.data.users[m.sender];
  if (user.afk > -1) {
    m.reply(` ${tradutor.texto2[0]} ${user.afkReason ? `${tradutor.texto2[1]}` + user.afkReason : ''}*
  
  *${tradutor.texto2[2]} ${(new Date - user.afk).toTimeString()}*
  `.trim());
    user.afk = -1;
    user.afkReason = '';
  }
  const jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
  for (const jid of jids) {
    const user = global.db.data.users[jid];
    if (!user) {
      continue;
    }
    const afkTime = user.afk;
    if (!afkTime || afkTime < 0) {
      continue;
    }
    const reason = user.afkReason || '';
    m.reply(`${tradutor.texto1[0]}

*—◉ ${tradutor.texto1[1]}*      
*—◉ ${reason ? `${tradutor.texto1[2]}` + reason : `${tradutor.texto1[3]}`}*
*—◉ ${tradutor.texto1[4]} ${(new Date - afkTime).toTimeString()}*
  `.trim());
  }
  return true;
}
