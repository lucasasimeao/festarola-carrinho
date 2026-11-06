// Tela do carrinho. Depende de produtos.js (LOJA, USOS, PRODUTOS) e pedido.js.

const $ = (id) => document.getElementById(id);
const CHAVE = "festarola-carrinho";

// Fundo do "card de foto" por categoria (enquanto não há fotos reais).
const CORES = {
  "Descartáveis": "#d9e4f5", "Potes e marmitex": "#fbe7b5", "Confeitaria": "#f8dcd6",
  "Sacolas e sacos": "#dcefe3", "Utilidades": "#e7dcf3",
};
const cor = (p) => CORES[p.categoria] || "#f7efe1";

// Foto: campo "foto" em produtos.js ou, por padrão, fotos/<id>.png. Se não existir, mostra o emoji.
function imagem(p) {
  const img = el("img", { src: p.foto || `fotos/${p.id}.png`, alt: p.nome, loading: "lazy" });
  img.onerror = () => { img.parentElement.classList.remove("com-foto"); img.replaceWith(p.emoji); };
  return img;
}

// carrinho: [{ id, opcao, qtd }] salvo no navegador
let carrinho = carregar();
let categoriaAtiva = "Todos";
let usoAtivo = null;

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE)) || [];
    return salvo.filter((i) => PRODUTOS.some((p) => p.id === i.id) && i.qtd > 0);
  } catch { return []; }
}
function salvar() { localStorage.setItem(CHAVE, JSON.stringify(carrinho)); }
const produto = (id) => PRODUTOS.find((p) => p.id === id);
const itens = () => carrinho.map((i) => itemCompleto(produto(i.id), i.opcao, i.qtd));

function el(tag, props = {}, ...filhos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "style") e.style.cssText = v;
    else if (k.startsWith("data-") || k === "aria-label") e.setAttribute(k, v);
    else e[k] = v;
  }
  for (const f of filhos) if (f != null) e.append(f);
  return e;
}

function toast(texto) {
  const t = $("toast");
  t.textContent = texto;
  t.classList.add("ver");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("ver"), 1700);
}

function stepper(valor, aoMudar) {
  const n = el("span", { textContent: valor });
  const menos = el("button", { type: "button", textContent: "−", "aria-label": "Diminuir" });
  const mais = el("button", { type: "button", textContent: "+", "aria-label": "Aumentar" });
  menos.onclick = () => aoMudar(-1, n);
  mais.onclick = () => aoMudar(1, n);
  return el("div", { className: "stepper" }, menos, n, mais);
}

// ---------- Compre por uso ----------
function desenharUsos() {
  $("lista-usos").replaceChildren(...USOS.map((u) => {
    const b = el("button", { type: "button", className: "uso" + (usoAtivo === u.id ? " ativo" : "") },
      el("div", { className: "img", style: `background:${u.cor}` }, el("img", { src: u.foto, alt: u.nome, loading: "lazy" })),
      el("b", { textContent: u.nome }),
      el("small", { textContent: u.texto }),
      el("span", { className: "ver", textContent: usoAtivo === u.id ? "Selecionado ✓" : "Ver produtos →" }));
    b.onclick = () => {
      usoAtivo = usoAtivo === u.id ? null : u.id;
      categoriaAtiva = "Todos";
      desenharTudo();
      document.getElementById("produtos").scrollIntoView();
    };
    return b;
  }));
}

// ---------- Filtros ----------
function desenharChips() {
  const chips = [];
  if (usoAtivo) {
    const u = USOS.find((x) => x.id === usoAtivo);
    const c = el("button", { type: "button", className: "chip uso-ativo", textContent: `${u.emoji} ${u.nome}  ×` });
    c.onclick = () => { usoAtivo = null; desenharTudo(); };
    chips.push(c);
  }
  const cats = ["Todos", ...new Set(PRODUTOS.map((p) => p.categoria))];
  for (const cat of cats) {
    const c = el("button", { type: "button", className: "chip" + (cat === categoriaAtiva ? " ativo" : ""), textContent: cat });
    c.onclick = () => { categoriaAtiva = cat; desenharChips(); desenharCatalogo(); };
    chips.push(c);
  }
  $("chips").replaceChildren(...chips);
}

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// ---------- Catálogo ----------
function desenharCatalogo() {
  const termo = semAcento($("busca").value.trim());
  const lista = PRODUTOS.filter((p) =>
    (categoriaAtiva === "Todos" || p.categoria === categoriaAtiva) &&
    (!usoAtivo || (p.usos || []).includes(usoAtivo)) &&
    (!termo || semAcento(`${p.nome} ${p.categoria} ${(p.opcoes || []).map((o) => o.nome || o).join(" ")}`).includes(termo)));
  $("vazio").classList.toggle("oculto", lista.length > 0);
  $("grade").replaceChildren(...lista.map(card));
}

function card(p) {
  const ops = normalizarOpcoes(p);
  let escolhida = ops.length === 1 ? ops[0].nome : null;
  let qtd = 1;

  const precos = ops.map((o) => (o.preco != null ? o.preco : p.preco));
  const variaPreco = precos.length > 1 && Math.min(...precos) !== Math.max(...precos);
  const precoEl = el("span", { className: "preco" });
  const unEl = el("span", { className: "un" });
  function atualizarPreco() {
    if (escolhida || !variaPreco) {
      const i = itemCompleto(p, escolhida, 1);
      precoEl.textContent = brl(i.preco);
      unEl.textContent = i.unidade;
    } else {
      precoEl.textContent = "a partir de " + brl(Math.min(...precos));
      unEl.textContent = "";
    }
  }
  atualizarPreco();

  let pills = null;
  if (ops.length) {
    pills = el("div", { className: "pills" });
    for (const o of ops) {
      const b = el("button", { type: "button", className: "pill" + (escolhida === o.nome ? " sel" : ""), textContent: o.nome });
      b.onclick = () => {
        escolhida = o.nome;
        pills.querySelectorAll(".pill").forEach((x) => x.classList.toggle("sel", x === b));
        atualizarPreco();
      };
      pills.append(b);
    }
  }

  const passo = stepper(qtd, (d, n) => { qtd = Math.max(1, qtd + d); n.textContent = qtd; });
  const add = el("button", { type: "button", className: "btn-add", textContent: "Adicionar" });
  add.onclick = () => {
    if (ops.length && !escolhida) {
      pills.classList.remove("tremer"); void pills.offsetWidth; pills.classList.add("tremer");
      toast("Escolha uma opção primeiro");
      return;
    }
    adicionar(p.id, escolhida, qtd);
    qtd = 1; passo.querySelector("span").textContent = 1;
  };

  return el("article", { className: "card" },
    el("div", { className: "foto com-foto", style: `background:${cor(p)}` },
      p.destaque ? el("span", { className: "tag", textContent: p.destaque }) : null, imagem(p)),
    el("span", { className: "cat", textContent: p.categoria }),
    el("h3", { textContent: p.nome }),
    el("div", { className: "linha-preco" }, precoEl, unEl),
    pills,
    el("div", { className: "acoes" }, passo, add));
}

// ---------- Carrinho ----------
function adicionar(id, opcao, qtd) {
  const item = carrinho.find((i) => i.id === id && i.opcao === opcao);
  if (item) item.qtd += qtd; else carrinho.push({ id, opcao, qtd });
  salvar(); atualizar();
  const p = produto(id);
  toast(`✓ ${qtd}x ${p.nome}${opcao ? " (" + opcao + ")" : ""} no pedido`);
}

function mudarQtd(indice, delta) {
  carrinho[indice].qtd += delta;
  if (carrinho[indice].qtd <= 0) carrinho.splice(indice, 1);
  salvar(); atualizar();
}

function atualizar() {
  const lista = itens();
  const qtd = lista.reduce((s, i) => s + i.qtd, 0);
  const total = brl(totalPedido(lista));
  $("badge").textContent = qtd;
  $("flu-qtd").textContent = `${qtd} ${qtd === 1 ? "item" : "itens"}`;
  $("flu-total").textContent = total;
  $("flutuante").classList.toggle("ver", qtd > 0 && !$("painel").classList.contains("aberto"));
  $("total").textContent = total;
  $("form").classList.toggle("oculto", !qtd);

  if (!qtd) {
    $("itens").replaceChildren(el("div", { className: "ok", style: "padding:40px 0" },
      el("div", { className: "ic", style: "background:var(--creme)", textContent: "🛍️" }),
      el("p", { textContent: "Seu pedido está vazio." }),
      el("button", { type: "button", className: "btn-voltar", textContent: "Ver produtos", "data-fechar": "" })));
    return;
  }
  $("itens").replaceChildren(...lista.map((i, n) =>
    el("div", { className: "item" },
      el("div", { className: "mini com-foto", style: `background:${cor(i.produto)}` }, imagem(i.produto)),
      el("div", { className: "info" },
        el("b", { textContent: i.produto.nome + (i.opcao ? ` (${i.opcao})` : "") }),
        el("small", { textContent: `${i.unidade} · ${brl(i.preco)} cada` }),
        el("div", { className: "baixo" },
          stepper(i.qtd, (d) => mudarQtd(n, d)),
          el("span", { className: "sub", textContent: brl(i.preco * i.qtd) }))))));
}

// ---------- Gaveta e envio ----------
function abrirPainel() {
  $("tela-carrinho").classList.remove("oculto");
  $("tela-ok").classList.add("oculto");
  $("titulo-gaveta").textContent = "Seu pedido";
  $("erro").textContent = "";
  $("painel").classList.add("aberto");
  $("flutuante").classList.remove("ver");
  document.body.classList.add("travado"); // a página de trás não rola junto
}
function fecharPainel() {
  $("painel").classList.remove("aberto");
  document.body.classList.remove("travado");
  atualizar();
}

const recebimento = () => document.querySelector('input[name="receb"]:checked').value;

function enviar(ev) {
  ev.preventDefault();
  const cliente = {
    nome: $("nome").value.trim(),
    recebimento: recebimento(),
    endereco: $("endereco-cli").value.trim(),
    data: $("data").value ? $("data").value.split("-").reverse().join("/") : "",
    pagamento: $("pagamento").value,
    troco: $("troco").value.trim(),
    obs: $("obs").value.trim(),
  };
  let erro = "";
  if (!carrinho.length) erro = "Seu pedido está vazio.";
  else if (!cliente.nome) erro = "Preencha seu nome.";
  else if (cliente.recebimento === "entrega" && !cliente.endereco) erro = "Preencha o endereço de entrega.";
  else if (!cliente.pagamento) erro = "Escolha a forma de pagamento.";
  $("erro").textContent = erro;
  if (erro) return;

  const codigo = codigoPedido();
  const link = linkWhatsApp(LOJA.whatsapp, montarMensagem({ loja: LOJA, itens: itens(), cliente, codigo }));
  localStorage.setItem("festarola-nome", cliente.nome);
  // Celular: abre o app do WhatsApp. Se o navegador bloquear a nova aba, abre na mesma.
  const aba = window.open(link, "_blank");
  if (!aba) window.location.href = link;

  carrinho = []; salvar(); atualizar();
  $("titulo-gaveta").textContent = "Tudo certo";
  $("ok-codigo").textContent = codigo;
  $("ok-link").href = link;
  $("tela-carrinho").classList.add("oculto");
  $("tela-ok").classList.remove("oculto");
}

// ---------- Início ----------
function desenharTudo() { desenharUsos(); desenharChips(); desenharCatalogo(); }

function iniciar() {
  $("descricao").textContent = LOJA.descricao;
  $("rod-descricao").textContent = LOJA.descricao + ". Embalagens, descartáveis e confeitaria.";
  $("rod-endereco").textContent = LOJA.endereco;
  $("rod-horario").textContent = LOJA.horario;
  $("aviso-entrega").textContent = LOJA.avisoEntrega;
  if (!LOJA.entrega) $("op-entrega").classList.add("oculto");
  $("pagamento").replaceChildren(el("option", { value: "", textContent: "Escolha" }),
    ...LOJA.pagamentos.map((p) => el("option", { value: p, textContent: p })));
  const hoje = new Date();
  $("data").min = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $("nome").value = localStorage.getItem("festarola-nome") || "";

  $("busca").oninput = desenharCatalogo;
  $("busca").onkeydown = (e) => { if (e.key === "Enter") e.target.blur(); }; // fecha o teclado do celular
  $("abrir-sacola").onclick = abrirPainel;
  $("flutuante").onclick = abrirPainel;
  $("painel").onclick = (e) => { if (e.target === $("painel") || e.target.closest("[data-fechar]")) fecharPainel(); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharPainel(); });
  document.querySelectorAll('input[name="receb"]').forEach((r) =>
    r.onchange = () => $("campo-endereco").classList.toggle("oculto", recebimento() !== "entrega"));
  $("pagamento").onchange = () => $("campo-troco").classList.toggle("oculto", $("pagamento").value !== "Dinheiro");
  $("form").onsubmit = enviar;

  desenharTudo(); atualizar();
}

iniciar();
