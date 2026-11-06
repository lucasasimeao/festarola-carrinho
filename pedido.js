// Regras do pedido (sem tela): opções, código, total e a mensagem do WhatsApp.
// Separado da tela para poder testar com node.

function brl(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

// Opções podem vir como texto ou { nome, preco, unidade }. Sempre devolve objetos.
function normalizarOpcoes(produto) {
  return (produto.opcoes || []).map((o) => (typeof o === "string" ? { nome: o } : o));
}

// Junta produto + opção escolhida: preço e unidade finais.
function itemCompleto(produto, nomeOpcao, qtd) {
  const op = normalizarOpcoes(produto).find((o) => o.nome === nomeOpcao);
  return {
    produto,
    opcao: nomeOpcao || null,
    qtd,
    preco: op && op.preco != null ? op.preco : produto.preco,
    unidade: (op && op.unidade) || produto.unidade,
  };
}

// Código curto para a loja achar o pedido: FST-0611-482
function codigoPedido(data = new Date()) {
  const dd = String(data.getDate()).padStart(2, "0");
  const mm = String(data.getMonth() + 1).padStart(2, "0");
  const n = String(Math.floor(Math.random() * 900) + 100);
  return `FST-${dd}${mm}-${n}`;
}

function totalPedido(itens) {
  return itens.reduce((soma, i) => soma + i.preco * i.qtd, 0);
}

// Mensagem agrupada por categoria, com caixinha para a loja marcar ao separar.
function montarMensagem({ loja, itens, cliente, codigo }) {
  const linhas = [];
  linhas.push(`*NOVO PEDIDO ${codigo}* 📦`);
  linhas.push(`${loja.nome}, via carrinho online`);
  linhas.push("");

  const porCategoria = {};
  for (const i of itens) (porCategoria[i.produto.categoria] ||= []).push(i);
  for (const categoria of Object.keys(porCategoria)) {
    linhas.push(`*${categoria.toUpperCase()}*`);
    for (const i of porCategoria[categoria]) {
      const opcao = i.opcao ? ` (${i.opcao})` : "";
      linhas.push(`☐ ${i.qtd}x ${i.produto.nome}${opcao}, ${i.unidade}, ${brl(i.preco * i.qtd)}`);
    }
    linhas.push("");
  }

  const qtdItens = itens.reduce((s, i) => s + i.qtd, 0);
  linhas.push(`*Total dos produtos: ${brl(totalPedido(itens))}* (${qtdItens} itens)`);
  linhas.push("");
  linhas.push(`👤 *Cliente:* ${cliente.nome}`);
  if (cliente.recebimento === "entrega") {
    linhas.push(`🚚 *Entrega:* ${cliente.endereco}`);
    linhas.push(`   ${loja.avisoEntrega}`);
  } else {
    linhas.push(`🏪 *Retirada:* ${loja.endereco}`);
  }
  if (cliente.data) linhas.push(`📅 *Para quando:* ${cliente.data}`);
  let pagamento = cliente.pagamento;
  if (pagamento === "Dinheiro" && cliente.troco) pagamento += ` (troco para ${cliente.troco})`;
  linhas.push(`💳 *Pagamento:* ${pagamento}`);
  if (cliente.obs) linhas.push(`📝 *Obs.:* ${cliente.obs}`);
  linhas.push("");
  linhas.push("_Preços e estoque sujeitos a confirmação da loja._");
  return linhas.join("\n");
}

function linkWhatsApp(numero, mensagem) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

if (typeof module !== "undefined") {
  module.exports = { brl, normalizarOpcoes, itemCompleto, codigoPedido, totalPedido, montarMensagem, linkWhatsApp };
}
