import type { BookingStoreData } from "@/lib/booking-types";

export const DEFAULT_BOOKINGS_DATA: BookingStoreData = {
  updatedAt: new Date().toISOString(),
  blockedDates: [
    {
      date: "2026-10-21",
      reason: "Revisão preventiva e polimento náutico da embarcação",
      createdAt: "2026-10-01T10:00:00.000Z"
    },
    {
      date: "2026-11-04",
      reason: "Troca programada de óleo dos motores",
      createdAt: "2026-10-05T14:30:00.000Z"
    }
  ],
  bookings: [
    // --- PASSEIOS JÁ REALIZADOS (HISTÓRICO) ---
    {
      id: "res_hist_001",
      code: "EAI-2026-3190",
      createdAt: "2026-09-02T14:20:00.000Z",
      date: "2026-09-12",
      time: "09:00h às 16:00h",
      tourTitle: "Ilha dos Frades & Guadalupe",
      tourSlug: "ilha-dos-frades-guadalupe",
      boatName: "Lancha Coral 33ft — 'Mar Azul'",
      boardingLocation: "Bahia Marina — Salvador/BA",
      client: {
        name: "Marcelo Fonseca",
        email: "marcelo.fonseca@yahoo.com.br",
        phone: "(71) 99876-5432",
        cpf: "345.678.901-22"
      },
      guests: {
        adults: 6,
        children: 2,
        totalGuests: 8
      },
      lunchPreference: "Almoço em Restaurante na Ilha dos Frades (Restaurante da Preta)",
      includeSunset: false,
      financial: {
        totalAmount: 3800,
        paidAmount: 3800,
        remainingAmount: 0,
        paymentMethod: "PIX",
        paymentStatus: "pago_total",
        paidAt: "2026-09-12T08:30:00.000Z"
      },
      bookingStatus: "realizado",
      notes: "Passeio realizado com excelente avaliação. Grupo elogiou a atenção do marinheiro Jorge.",
      clientNotes: "Celebração de aniversário de casamento. Pediram apoio para reserva da mesa."
    },
    {
      id: "res_hist_002",
      code: "EAI-2026-4412",
      createdAt: "2026-09-15T11:05:00.000Z",
      date: "2026-09-20",
      time: "09:00h às 17:30h (Com Pôr do Sol)",
      tourTitle: "Volta Completa nas Ilhas (Day Use)",
      tourSlug: "volta-completa-nas-ilhas",
      boatName: "Lancha NX Boats 36ft — 'Oceano Dourado'",
      boardingLocation: "Marina da Penha — Ribeira, Salvador/BA",
      client: {
        name: "Camila Albuquerque",
        email: "camila.albuquerque@adv.com.br",
        phone: "(71) 98765-4321",
        cpf: "456.789.012-33"
      },
      guests: {
        adults: 10,
        children: 0,
        totalGuests: 10
      },
      lunchPreference: "Churrasqueira a Bordo da Lancha",
      includeSunset: true,
      financial: {
        totalAmount: 5200,
        paidAmount: 5200,
        remainingAmount: 0,
        paymentMethod: "Cartão de Crédito",
        paymentStatus: "pago_total",
        paidAt: "2026-09-19T17:00:00.000Z"
      },
      bookingStatus: "realizado",
      notes: "Sucesso absoluto no pôr do sol na Ponta do Humaitá. Consumiram 3 sacos extras de gelo.",
      clientNotes: "Confraternização da equipe de advogados. Levaram cortes nobres para churrasco."
    },
    {
      id: "res_hist_003",
      code: "EAI-2026-5821",
      createdAt: "2026-09-22T09:15:00.000Z",
      date: "2026-09-27",
      time: "09:00h às 16:00h",
      tourTitle: "Bom Jesus dos Passos & Histórico",
      tourSlug: "bom-jesus-dos-passos",
      boatName: "Lancha Real 32ft — 'Estrela da Baía'",
      boardingLocation: "Terminal Turístico Náutico da Bahia — Salvador",
      client: {
        name: "Rodrigo Nogueira",
        email: "rodrigo.nog@gmail.com",
        phone: "(71) 99111-2233",
        cpf: "567.890.123-44"
      },
      guests: {
        adults: 4,
        children: 1,
        totalGuests: 5
      },
      lunchPreference: "Almoço Típico em Bom Jesus dos Passos",
      includeSunset: false,
      financial: {
        totalAmount: 3200,
        paidAmount: 3200,
        remainingAmount: 0,
        paymentMethod: "PIX",
        paymentStatus: "pago_total",
        paidAt: "2026-09-27T08:45:00.000Z"
      },
      bookingStatus: "realizado",
      notes: "Passeio tranquilo em mar liso. Visitaram a vila histórica e tiraram fotos no cais.",
      clientNotes: "Primeira vez da filha de 5 anos no mar. Marinheiro teve cuidado redobrado."
    },
    {
      id: "res_hist_004",
      code: "EAI-2026-6204",
      createdAt: "2026-09-29T16:40:00.000Z",
      date: "2026-10-04",
      time: "09:00h às 16:00h",
      tourTitle: "Coroa do Frade & Bancos de Areia",
      tourSlug: "coroa-do-frade-bancos-de-areia",
      boatName: "Lancha NX Boats 36ft — 'Oceano Dourado'",
      boardingLocation: "Bahia Marina — Salvador/BA",
      client: {
        name: "Mariana Sampaio",
        email: "mari.sampaio.arq@uol.com.br",
        phone: "(71) 98222-3344",
        cpf: "678.901.234-55"
      },
      guests: {
        adults: 8,
        children: 0,
        totalGuests: 8
      },
      lunchPreference: "Lanches & Petiscos Próprios",
      includeSunset: false,
      financial: {
        totalAmount: 4400,
        paidAmount: 4400,
        remainingAmount: 0,
        paymentMethod: "PIX",
        paymentStatus: "pago_total",
        paidAt: "2026-10-04T08:50:00.000Z"
      },
      bookingStatus: "realizado",
      notes: "Maré perfeita 0.2m na Coroa do Frade. Fotos espetaculares publicadas no Instagram.",
      clientNotes: "Pediram orientação exata sobre o horário de pico da maré baixa."
    },
    {
      id: "res_hist_005",
      code: "EAI-2026-7089",
      createdAt: "2026-10-02T18:10:00.000Z",
      date: "2026-10-10",
      time: "09:00h às 16:00h",
      tourTitle: "Ilha dos Frades & Guadalupe",
      tourSlug: "ilha-dos-frades-guadalupe",
      boatName: "Lancha Coral 33ft — 'Mar Azul'",
      boardingLocation: "Bahia Marina — Salvador/BA",
      client: {
        name: "Eduardo Meirelles",
        email: "edu.meirelles@medicina.ufba.br",
        phone: "(71) 99333-4455",
        cpf: "789.012.345-66"
      },
      guests: {
        adults: 7,
        children: 2,
        totalGuests: 9
      },
      lunchPreference: "Almoço em Restaurante na Ilha",
      includeSunset: false,
      financial: {
        totalAmount: 3900,
        paidAmount: 3900,
        remainingAmount: 0,
        paymentMethod: "Cartão de Crédito",
        paymentStatus: "pago_total",
        paidAt: "2026-10-09T15:30:00.000Z"
      },
      bookingStatus: "realizado",
      notes: "Passeio realizado com sucesso no feriado prolongado.",
      clientNotes: "Família reunida com avós. Marinheiro auxiliou no desembarque seguro no píer."
    },

    // --- PRÓXIMOS PASSEIOS (PAGO TOTAL, 50% PAGO, PENDENTE) ---
    {
      id: "res_prox_001",
      code: "EAI-2026-8145",
      createdAt: "2026-10-08T10:30:00.000Z",
      date: "2026-10-17",
      time: "09:00h às 17:30h (Com Pôr do Sol)",
      tourTitle: "Volta Completa nas Ilhas (Day Use)",
      tourSlug: "volta-completa-nas-ilhas",
      boatName: "Lancha NX Boats 36ft — 'Oceano Dourado'",
      boardingLocation: "Bahia Marina — Salvador/BA",
      client: {
        name: "Beatriz Mendonça",
        email: "beatriz.mendonca@gmail.com",
        phone: "(71) 99777-8899",
        cpf: "890.123.456-77"
      },
      guests: {
        adults: 8,
        children: 1,
        totalGuests: 9
      },
      lunchPreference: "Churrasqueira a Bordo da Lancha",
      includeSunset: true,
      financial: {
        totalAmount: 4950,
        paidAmount: 4950,
        remainingAmount: 0,
        paymentMethod: "PIX",
        paymentStatus: "pago_total",
        paidAt: "2026-10-08T11:00:00.000Z"
      },
      bookingStatus: "confirmado",
      notes: "Pagamento 100% quitado via PIX antecipado. Lancha confirmada com marinheiro Carlos.",
      clientNotes: "Comemoração de 30 anos. Trarão picanha e bebidas importadas. Geladeira e som revisados."
    },
    {
      id: "res_prox_002",
      code: "EAI-2026-8392",
      createdAt: "2026-10-11T13:45:00.000Z",
      date: "2026-10-18",
      time: "09:00h às 16:00h",
      tourTitle: "Ilha dos Frades & Guadalupe",
      tourSlug: "ilha-dos-frades-guadalupe",
      boatName: "Lancha Coral 33ft — 'Mar Azul'",
      boardingLocation: "Terminal Turístico Náutico da Bahia — Salvador",
      client: {
        name: "Lucas Silveira",
        email: "lucas.silveira@techbahia.io",
        phone: "(71) 99123-9988",
        cpf: "901.234.567-88"
      },
      guests: {
        adults: 6,
        children: 0,
        totalGuests: 6
      },
      lunchPreference: "Almoço em Restaurante na Ilha dos Frades",
      includeSunset: false,
      financial: {
        totalAmount: 3600,
        paidAmount: 1800,
        remainingAmount: 1800,
        paymentMethod: "PIX",
        paymentStatus: "pago_parcial",
        paidAt: "2026-10-11T14:00:00.000Z"
      },
      bookingStatus: "confirmado",
      notes: "Sinal de 50% (R$ 1.800) recebido via PIX. Saldo restante de R$ 1.800 será pago no embarque.",
      clientNotes: "Grupo quer fazer a subida na Igreja de Guadalupe para fotos aéreas."
    },
    {
      id: "res_prox_003",
      code: "EAI-2026-8711",
      createdAt: "2026-10-13T17:20:00.000Z",
      date: "2026-10-24",
      time: "09:00h às 16:00h",
      tourTitle: "Coroa do Frade & Bancos de Areia",
      tourSlug: "coroa-do-frade-bancos-de-areia",
      boatName: "Lancha Real 32ft — 'Estrela da Baía'",
      boardingLocation: "Bahia Marina — Salvador/BA",
      client: {
        name: "Fabio Teixeira",
        email: "fabio.teixeira@construtoraba.com.br",
        phone: "(71) 98888-7766",
        cpf: "012.345.678-99"
      },
      guests: {
        adults: 7,
        children: 2,
        totalGuests: 9
      },
      lunchPreference: "Churrasqueira a Bordo da Lancha",
      includeSunset: false,
      financial: {
        totalAmount: 4100,
        paidAmount: 2050,
        remainingAmount: 2050,
        paymentMethod: "PIX",
        paymentStatus: "pago_parcial",
        paidAt: "2026-10-13T18:15:00.000Z"
      },
      bookingStatus: "confirmado",
      notes: "Sinal de 50% creditado. Restante agendado para PIX presencial antes da largada.",
      clientNotes: "Solicitou churrasqueira a carvão náutico e tábua de corte grande."
    },
    {
      id: "res_prox_004",
      code: "EAI-2026-8940",
      createdAt: "2026-10-14T19:30:00.000Z",
      date: "2026-10-25",
      time: "09:00h às 16:00h",
      tourTitle: "Bom Jesus dos Passos & Histórico",
      tourSlug: "bom-jesus-dos-passos",
      boatName: "Lancha Coral 33ft — 'Mar Azul'",
      boardingLocation: "Marina da Penha — Ribeira, Salvador/BA",
      client: {
        name: "Larissa Dantas",
        email: "larissa.dantas@designestudio.com",
        phone: "(71) 99444-5566",
        cpf: "123.098.456-11"
      },
      guests: {
        adults: 4,
        children: 0,
        totalGuests: 4
      },
      lunchPreference: "Almoço Típico em Bom Jesus dos Passos",
      includeSunset: false,
      financial: {
        totalAmount: 3200,
        paidAmount: 0,
        remainingAmount: 3200,
        paymentMethod: "WhatsApp",
        paymentStatus: "pendente",
        paidAt: null
      },
      bookingStatus: "confirmado",
      notes: "Cliente fez o agendamento no site. Aguardando envio do comprovante do sinal de 50% no WhatsApp.",
      clientNotes: "Pediu indicação do melhor restaurante para comer moqueca de camarão em Bom Jesus."
    },
    {
      id: "res_prox_005",
      code: "EAI-2026-9102",
      createdAt: "2026-10-15T09:10:00.000Z",
      date: "2026-10-31",
      time: "09:00h às 17:30h (Com Pôr do Sol)",
      tourTitle: "Volta Completa nas Ilhas (Day Use)",
      tourSlug: "volta-completa-nas-ilhas",
      boatName: "Lancha NX Boats 36ft — 'Oceano Dourado'",
      boardingLocation: "Bahia Marina — Salvador/BA",
      client: {
        name: "Guilherme Bastos",
        email: "guilherme.bastos@invest.com.br",
        phone: "(71) 99654-3210",
        cpf: "234.567.890-00"
      },
      guests: {
        adults: 10,
        children: 2,
        totalGuests: 12
      },
      lunchPreference: "Churrasqueira a Bordo da Lancha",
      includeSunset: true,
      financial: {
        totalAmount: 5600,
        paidAmount: 5600,
        remainingAmount: 0,
        paymentMethod: "Cartão de Crédito",
        paymentStatus: "pago_total",
        paidAt: "2026-10-15T09:30:00.000Z"
      },
      bookingStatus: "confirmado",
      notes: "Pagamento 100% efetuado em 3x no cartão. Capacidade máxima de 12 passageiros reservada.",
      clientNotes: "Celebração de Réveillon antecipado de amigos de São Paulo. Pediram espumante de cortesia."
    },
    {
      id: "res_prox_006",
      code: "EAI-2026-9285",
      createdAt: "2026-10-15T11:40:00.000Z",
      date: "2026-11-07",
      time: "09:00h às 16:00h",
      tourTitle: "Ilha dos Frades & Guadalupe",
      tourSlug: "ilha-dos-frades-guadalupe",
      boatName: "Lancha Coral 33ft — 'Mar Azul'",
      boardingLocation: "Bahia Marina — Salvador/BA",
      client: {
        name: "Patricia Lacerda",
        email: "patricia.lacerda@advocacia.com.br",
        phone: "(71) 98111-9900",
        cpf: "345.123.678-55"
      },
      guests: {
        adults: 5,
        children: 1,
        totalGuests: 6
      },
      lunchPreference: "Almoço em Restaurante na Ilha dos Frades",
      includeSunset: false,
      financial: {
        totalAmount: 3600,
        paidAmount: 1800,
        remainingAmount: 1800,
        paymentMethod: "PIX",
        paymentStatus: "pago_parcial",
        paidAt: "2026-10-15T12:00:00.000Z"
      },
      bookingStatus: "confirmado",
      notes: "Sinal de 50% pago via PIX. Cliente confirmou pontualidade às 08:45h na Bahia Marina.",
      clientNotes: "Solicitou orientações de estacionamento náutico na marina."
    },
    {
      id: "res_prox_007",
      code: "EAI-2026-9411",
      createdAt: "2026-10-15T12:15:00.000Z",
      date: "2026-11-14",
      time: "09:00h às 16:00h",
      tourTitle: "Coroa do Frade & Bancos de Areia",
      tourSlug: "coroa-do-frade-bancos-de-areia",
      boatName: "Lancha Real 32ft — 'Estrela da Baía'",
      boardingLocation: "Terminal Turístico Náutico da Bahia — Salvador",
      client: {
        name: "Renato Viana",
        email: "renato.viana@engenharia.com",
        phone: "(71) 99222-8877",
        cpf: "456.234.789-88"
      },
      guests: {
        adults: 6,
        children: 0,
        totalGuests: 6
      },
      lunchPreference: "Lanches & Petiscos Próprios",
      includeSunset: false,
      financial: {
        totalAmount: 3800,
        paidAmount: 0,
        remainingAmount: 3800,
        paymentMethod: "PIX",
        paymentStatus: "pendente",
        paidAt: null
      },
      bookingStatus: "confirmado",
      notes: "Pré-reserva realizada no site. Vencimento do sinal em 24h.",
      clientNotes: "Passeio de despedida de solteiro. Trarão bebidas e gelo extra."
    }
  ]
};
