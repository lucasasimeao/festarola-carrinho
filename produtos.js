// =====================================================================
// CONFIGURAÇÃO DA LOJA E CATÁLOGO
// Para trocar produtos, preços ou o número do WhatsApp, edite só este arquivo.
// ATENÇÃO: produtos, preços e número abaixo são FICTÍCIOS (MVP de demonstração).
// =====================================================================

const LOJA = {
  nome: "Festarola",
  descricao: "Distribuidora de Embalagens",
  endereco: "Mercadão Municipal, Centro, Taubaté/SP",
  horario: "Horário a confirmar",
  // Número que recebe os pedidos: 55 + DDD + número, só dígitos.
  whatsapp: "5512974046518", // DEMO: celular pessoal do Lucas. Trocar pelo da Festarola antes de entregar
  pagamentos: ["Pix", "Dinheiro", "Cartão de débito", "Cartão de crédito"],
  entrega: true, // false = só retirada no Mercadão
  avisoEntrega: "Taxa de entrega a combinar pelo WhatsApp.",
};

// "Compre por uso" (como o "compre por tema" das lojas gringas).
const USOS = [
  { id: "confeitaria", foto: "fotos/caixa-bolo.png", nome: "Confeitaria", emoji: "🧁", cor: "#f8dcd6", texto: "Caixas, forminhas e bases" },
  { id: "delivery", foto: "fotos/marmitex.png", nome: "Delivery e marmitex", emoji: "🥡", cor: "#fbe7b5", texto: "Potes, marmitas e sacolas" },
  { id: "lanchonete", foto: "fotos/hamb.png", nome: "Lanchonete", emoji: "🍔", cor: "#d9e4f5", texto: "Copos, canudos e embalagens" },
  { id: "festa", foto: "fotos/balao.png", nome: "Festa em casa", emoji: "🎉", cor: "#e7dcf3", texto: "Descartáveis e decoração" },
  { id: "presente", foto: "fotos/sacola-kraft.png", nome: "Presentes", emoji: "🎁", cor: "#dcefe3", texto: "Sacolas, caixas e fitas" },
];

// categoria: filtro e agrupamento do pedido na hora de separar.
// usos: em quais blocos de "Compre por uso" o produto aparece.
// opcoes: o cliente escolhe uma. Pode ser texto ("Branco") ou
//         { nome, preco, unidade } quando a opção muda o preço.
// destaque: selo no card (opcional).
const PRODUTOS = [
  // Descartáveis
  { id: "copo-200", nome: "Copo descartável 200 ml", unidade: "pct 100 un", preco: 6.9, categoria: "Descartáveis", emoji: "🥤",
    usos: ["festa", "lanchonete"], destaque: "Mais vendido",
    opcoes: [{ nome: "Pct 100 un", preco: 6.9 }, { nome: "Caixa 2.500 un", preco: 149.0, unidade: "cx 2.500 un" }] },
  { id: "copo-cafe", nome: "Copo de papel para café 180 ml", unidade: "pct 50 un", preco: 14.9, categoria: "Descartáveis", emoji: "☕",
    usos: ["lanchonete"] },
  { id: "prato", nome: "Prato descartável", unidade: "pct 10 un", preco: 3.9, categoria: "Descartáveis", emoji: "🍽️",
    usos: ["festa"],
    opcoes: [{ nome: "15 cm", preco: 3.9 }, { nome: "18 cm", preco: 4.9 }, { nome: "21 cm", preco: 5.9 }] },
  { id: "talher", nome: "Garfo ou colher descartável", unidade: "pct 50 un", preco: 5.5, categoria: "Descartáveis", emoji: "🍴",
    usos: ["festa", "delivery"], opcoes: ["Garfo", "Colher", "Faca", "Garfinho de sobremesa"] },
  { id: "guard", nome: "Guardanapo de papel", unidade: "pct 50 un", preco: 4.2, categoria: "Descartáveis", emoji: "🧻",
    usos: ["festa", "lanchonete"] },
  { id: "canudo", nome: "Canudo de papel", unidade: "pct 100 un", preco: 9.9, categoria: "Descartáveis", emoji: "🥢",
    usos: ["lanchonete", "festa"] },

  // Potes e marmitex
  { id: "marmitex", nome: "Marmitex de alumínio", unidade: "cx 100 un", preco: 52.0, categoria: "Potes e marmitex", emoji: "🍱",
    usos: ["delivery"], destaque: "Mais vendido",
    opcoes: [{ nome: "Nº 7 (500 ml)", preco: 46.0 }, { nome: "Nº 8 (750 ml)", preco: 52.0 }, { nome: "Nº 9 (1 L)", preco: 61.0 }] },
  { id: "pote", nome: "Pote plástico com tampa", unidade: "pct 25 un", preco: 13.9, categoria: "Potes e marmitex", emoji: "🥡",
    usos: ["delivery", "confeitaria"],
    opcoes: [{ nome: "250 ml", preco: 13.9 }, { nome: "500 ml", preco: 17.9 }, { nome: "750 ml", preco: 21.9 }] },
  { id: "molho", nome: "Potinho para molho 50 ml", unidade: "pct 100 un", preco: 12.5, categoria: "Potes e marmitex", emoji: "🫙",
    usos: ["delivery", "lanchonete"] },
  { id: "hamb", nome: "Embalagem para hambúrguer", unidade: "pct 50 un", preco: 24.9, categoria: "Potes e marmitex", emoji: "🍔",
    usos: ["lanchonete", "delivery"], destaque: "Novidade" },

  // Confeitaria
  { id: "forminha", nome: "Forminha para doce", unidade: "pct 100 un", preco: 5.9, categoria: "Confeitaria", emoji: "🧁",
    usos: ["confeitaria", "festa"], destaque: "Mais vendido",
    opcoes: ["Nº 4 branca", "Nº 5 branca", "Nº 5 kraft", "Nº 5 dourada", "Nº 5 rosa"] },
  { id: "caixa-bolo", nome: "Caixa para bolo com visor", unidade: "un", preco: 4.5, categoria: "Confeitaria", emoji: "🎂",
    usos: ["confeitaria"],
    opcoes: [{ nome: "20 cm", preco: 4.5 }, { nome: "25 cm", preco: 5.9 }, { nome: "30 cm", preco: 7.5 }] },
  { id: "caixa-doce", nome: "Caixa para brigadeiro", unidade: "pct 10 un", preco: 8.9, categoria: "Confeitaria", emoji: "🍫",
    usos: ["confeitaria", "presente"],
    opcoes: [{ nome: "4 doces", preco: 8.9 }, { nome: "6 doces", preco: 10.9 }, { nome: "9 doces", preco: 13.9 }] },
  { id: "base-bolo", nome: "Base laminada para bolo", unidade: "un", preco: 3.2, categoria: "Confeitaria", emoji: "🥮",
    usos: ["confeitaria"], opcoes: [{ nome: "Ouro 25 cm", preco: 3.2 }, { nome: "Prata 25 cm", preco: 3.2 }, { nome: "Ouro 30 cm", preco: 4.1 }] },

  // Sacolas e sacos
  { id: "sacola-kraft", nome: "Sacola kraft com alça", unidade: "pct 10 un", preco: 12.9, categoria: "Sacolas e sacos", emoji: "🛍️",
    usos: ["presente", "delivery"],
    opcoes: [{ nome: "P", preco: 12.9 }, { nome: "M", preco: 16.9 }, { nome: "G", preco: 21.9 }] },
  { id: "sacola-plast", nome: "Sacola plástica reciclada", unidade: "pacote 1 kg", preco: 15.9, categoria: "Sacolas e sacos", emoji: "🛒",
    usos: ["delivery"], opcoes: ["30 x 40 cm", "40 x 50 cm", "50 x 60 cm"] },
  { id: "saco-pao", nome: "Saco de papel para pão", unidade: "pct 500 un", preco: 29.9, categoria: "Sacolas e sacos", emoji: "🥖",
    usos: ["lanchonete"] },
  { id: "celofane", nome: "Saquinho de celofane", unidade: "pct 100 un", preco: 7.9, categoria: "Sacolas e sacos", emoji: "🍬",
    usos: ["confeitaria", "presente", "festa"], opcoes: ["10 x 14 cm", "15 x 22 cm", "20 x 29 cm"] },

  // Utilidades
  { id: "pvc", nome: "Filme PVC 28 cm", unidade: "rolo 100 m", preco: 18.9, categoria: "Utilidades", emoji: "🎞️",
    usos: ["delivery", "confeitaria"] },
  { id: "aluminio", nome: "Papel alumínio 30 cm", unidade: "rolo 7,5 m", preco: 8.9, categoria: "Utilidades", emoji: "🪙",
    usos: ["delivery"] },
  { id: "fita", nome: "Fita de cetim", unidade: "rolo 10 m", preco: 4.9, categoria: "Utilidades", emoji: "🎀", foto: "fotos/fita.png",
    usos: ["presente", "confeitaria"], opcoes: ["Vermelha", "Rosa", "Dourada", "Branca", "Azul"] },
  { id: "balao", nome: "Balão de látex nº 9", unidade: "pct 50 un", preco: 11.9, categoria: "Utilidades", emoji: "🎈",
    usos: ["festa"], opcoes: ["Vermelho", "Azul", "Rosa", "Branco", "Dourado", "Sortido"] },
];

if (typeof module !== "undefined") module.exports = { LOJA, USOS, PRODUTOS };
