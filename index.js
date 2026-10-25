const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ChannelType, 
    PermissionFlagsBits, 
    EmbedBuilder 
} = require('discord.js');

// ⚙️ SEU TOKEN DO BOT DE CROSS TRADE
const TOKEN = 'MTU2Mzk5MjYxODk5MDQzNjQ0Mw.GspPJ9.73S82U4H3Fgn9griEfUpBhKoDJ-MzO1FKRE0uY';
const PREFIXO = '7';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`🤖 Bot de Ticket Hashira online como: ${client.user.tag}`);
});

// Comando para enviar o Painel Central de Tickets com todas as opções
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === `${PREFIXO}ticket` || message.content.toLowerCase() === `${PREFIXO}setup`) {
        
        // Verifica se o membro é administrador
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('⚠️ Você precisa ser um Administrador para usar este comando.');
        }

        const embedPainel = new EmbedBuilder()
            .setTitle('🔄 HASHIRA CROSS TRADES - CENTRAL DE TICKET')
            .setDescription(
                'Selecione uma das opções abaixo para falar com nossa Staff de forma privada:\n\n' +
                '🔄 **Solicitar Middleman (MM):** Para realizar trocas de itens/contas com segurança.\n' +
                '🛡️ **Denunciar Scammer:** Caso tenha sido vítima de golpe ou queira reportar alguém.\n' +
                '💳 **Pagamento:** Dúvidas ou confirmações sobre pagamentos e taxas.\n' +
                '🤝 **Parceria:** Propostas de parceria com o servidor.\n' +
                '❓ **Suporte / Ajuda:** Dúvidas gerais ou ajuda com o servidor.\n' +
                '📌 **Outros:** Outros assuntos.'
            )
            .setColor('#8A2BE2') // Roxo Hashira
            .setFooter({ text: 'Hashira Cross Trades • Sistema de Segurança' });

        // Primeira linha de botões
        const rowBotoes1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_mm')
                .setLabel('Middleman (MM)')
                .setEmoji('🔄')
                .setStyle(ButtonStyle.Primary), // Azul
            new ButtonBuilder()
                .setCustomId('ticket_denuncia')
                .setLabel('Denunciar Scammer')
                .setEmoji('🛡️')
                .setStyle(ButtonStyle.Danger), // Vermelho
            new ButtonBuilder()
                .setCustomId('ticket_pagamento')
                .setLabel('Pagamento')
                .setEmoji('💳')
                .setStyle(ButtonStyle.Success) // Verde
        );

        // Segunda linha de botões (com Parceria, Suporte e Outros)
        const rowBotoes2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_parceria')
                .setLabel('Parceria')
                .setEmoji('🤝')
                .setStyle(ButtonStyle.Secondary), // Cinza
            new ButtonBuilder()
                .setCustomId('ticket_suporte')
                .setLabel('Suporte / Ajuda')
                .setEmoji('❓')
                .setStyle(ButtonStyle.Secondary), // Cinza
            new ButtonBuilder()
                .setCustomId('ticket_outros')
                .setLabel('Outros')
                .setEmoji('📌')
                .setStyle(ButtonStyle.Secondary) // Cinza
        );

        await message.channel.send({ embeds: [embedPainel], components: [rowBotoes1, rowBotoes2] });
    }
});

// Gerenciador de cliques nos botões
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const { customId, guild, user } = interaction;

    if (customId.startsWith('ticket_')) {
        let tipoTicket = 'outros';
        let tituloEmbed = '📌 OUTROS ASSUNTOS';
        let corEmbed = '#95A5A6'; // Cinza

        if (customId === 'ticket_mm') {
            tipoTicket = 'mm';
            tituloEmbed = '🔄 ATENDIMENTO MIDDLEMAN (TROCA)';
            corEmbed = '#3498DB'; // Azul
        } else if (customId === 'ticket_denuncia') {
            tipoTicket = 'denuncia';
            tituloEmbed = '🛡️ DENÚNCIA DE SCAMMER';
            corEmbed = '#E74C3C'; // Vermelho
        } else if (customId === 'ticket_pagamento') {
            tipoTicket = 'pagamento';
            tituloEmbed = '💳 SETOR DE PAGAMENTO';
            corEmbed = '#2ECC71'; // Verde
        } else if (customId === 'ticket_parceria') {
            tipoTicket = 'parceria';
            tituloEmbed = '🤝 PROPOSTA DE PARCERIA';
            corEmbed = '#9B59B6'; // Roxo
        } else if (customId === 'ticket_suporte') {
            tipoTicket = 'suporte';
            tituloEmbed = '❓ SUPORTE / AJUDA GERAL';
            corEmbed = '#F1C40F'; // Amarelo
        }

        const nomeCanal = `ticket-${tipoTicket}-${user.username}`.toLowerCase();

        // Verifica se já tem ticket aberto desse tipo
        const canalExistente = guild.channels.cache.find(c => c.name === nomeCanal);
        if (canalExistente) {
            return interaction.reply({ content: `⚠️ Já tens um ticket aberto em ${canalExistente}!`, ephemeral: true });
        }

        // Criar o canal privado
        const canalTicket = await guild.channels.create({
            name: nomeCanal,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                {
                    id: client.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.EmbedLinks
                    ]
                }
            ]
        });

        const embedBoasVindas = new EmbedBuilder()
            .setTitle(tituloEmbed)
            .setDescription(
                `Olá <@${user.id}>! Este é o teu ticket privado.\n\n` +
                'A nossa Staff responderá em breve. Por favor, detalha o motivo do teu contacto.'
            )
            .setColor(corEmbed)
            .setFooter({ text: 'Usa o botão abaixo para encerrar o atendimento.' });

        const rowFechar = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('fechar_ticket')
                .setLabel('Fechar Ticket')
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Danger)
        );

        await canalTicket.send({ content: `<@${user.id}>`, embeds: [embedBoasVindas], components: [rowFechar] });
        await interaction.reply({ content: `✅ Ticket criado com sucesso em ${canalTicket}`, ephemeral: true });
    }

    if (customId === 'fechar_ticket') {
        await interaction.reply('🔒 Este ticket será fechado e eliminados em 5 segundos...');
        setTimeout(() => {
            interaction.channel.delete().catch(() => {});
        }, 5000);
    }
});

client.login('MTU2Mzk5MjYxODk5MDQzNjQ0Mw.GspPJ9.73S82U4H3Fgn9griEfUpBhKoDJ-MzO1FKRE0uY');
