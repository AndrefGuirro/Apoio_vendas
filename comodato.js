let clientes = [];
let filtroRotaAtivo = false;
let diaSelecionado = "";

// Definir a ordem desejada dos dias da semana
const ordemDias = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

// Função para corrigir problemas de codificação (exemplo: "Litrão")
function corrigirTexto(texto) {
  if (!texto) return "";
  return texto.replace("Litrï¿½o", "Litrão");
}

// Função para carregar o CSV e exibir os clientes na tabela
async function carregarCSV() {
  const response = await fetch("clientes.csv");
  const data = await response.text();

  const linhas = data.split("\n").map(linha => linha.trim()).filter(linha => linha);
  const cabecalho = linhas[0].split(";");

  // Criar o array de clientes
  clientes = linhas.slice(1).map(linha => {
    const valores = linha.split(";");
    let cliente = {};
    cabecalho.forEach((coluna, index) => {
      cliente[coluna.trim()] = corrigirTexto(valores[index]?.trim());
    });
    return cliente;
  });

  // Ordenar clientes pela ordem dos dias da semana
  clientes.sort((a, b) => {
    const diaA = (a["ROTA"] || "").toLowerCase();
    const diaB = (b["ROTA"] || "").toLowerCase();
    return ordemDias.indexOf(diaA) - ordemDias.indexOf(diaB);
  });

  // Exibir os clientes ordenados ao carregar o CSV
  exibirClientes(clientes);
}

// Função para exibir os clientes na tabela
function exibirClientes(clientesFiltrados) {
  let tabela = document.getElementById("tabela-clientes");
  tabela.innerHTML = ""; // Limpa a tabela antes de exibir os dados

  clientesFiltrados.forEach(cliente => {
    let linha = `<tr>
      <td>${cliente["CODIGO"]}</td>
      <td>${cliente["CLIENTE"]}</td>
      <td>${cliente["TIPO"]}</td>
      <td>${cliente["QTDE"]}</td>
    </tr>`;
    tabela.innerHTML += linha;
  });
}

// Função para filtrar os clientes conforme a busca
function filtrarClientes() {
  const input = document.getElementById("search-input").value.toLowerCase();

  let clientesFiltrados = clientes.filter(cliente => {
    return (
      cliente["CODIGO"].toLowerCase().includes(input) ||
      cliente["CLIENTE"].toLowerCase().includes(input) ||
      cliente["TIPO"].toLowerCase().includes(input)
    );
  });

  // Aplicar filtro de rota se estiver ativado
  if (filtroRotaAtivo && diaSelecionado) {
    clientesFiltrados = clientesFiltrados.filter(cliente => 
      cliente["ROTA"] && cliente["ROTA"].toLowerCase() === diaSelecionado
    );
  }

  exibirClientes(clientesFiltrados);

  // Mostrar ou esconder o "X" dependendo se há pesquisa
  const clearButton = document.getElementById("clear-search");
  if (input.length > 0) {
    clearButton.classList.add("show");
  } else {
    clearButton.classList.remove("show");
  }
}

// Função para limpar a busca
function limparBusca() {
  document.getElementById("search-input").value = "";
  aplicarFiltroRota(); // Mantém o filtro da rota se estiver ativo
  const clearButton = document.getElementById("clear-search");
  clearButton.classList.remove("show");
}

// Função para aplicar ou remover o filtro de rota
function aplicarFiltroRota(dia = "") {
  if (dia === diaSelecionado) {
    filtroRotaAtivo = false;
    diaSelecionado = "";
    document.getElementById("rota-btn").classList.remove("active");
    exibirClientes(clientes);
  } else {
    filtroRotaAtivo = true;
    diaSelecionado = dia;
    document.getElementById("rota-btn").classList.add("active");
    exibirClientes(clientes.filter(cliente => cliente["ROTA"]?.toLowerCase() === dia));
  }
}

// Carregar os clientes ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  carregarCSV();
});
