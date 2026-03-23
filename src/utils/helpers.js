// src/utils/helpers.js

export const formatBRL = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

export const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
};

export const formatDateTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR')}`;
};

// Gera código aleatório de 7 dígitos alfanumérico
export const gerarCodigo7 = () =>
  Math.random().toString(36).substr(2, 7).toUpperCase();

// Gera número de unidade #XXXXX
export const gerarUnidade = () =>
  `#${Math.floor(10000 + Math.random() * 90000)}`;

// Valida CPF
export function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0, r;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(cpf[10]);
}

// Valida data de nascimento e verifica idade mínima 18 anos
export function validarIdade(dataNasc) {
  if (!dataNasc) return false;
  const nasc = new Date(dataNasc);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade >= 18;
}

// Calcula prêmio de uma aposta
export function calcularPremio(valorAposta, multiplicador, fatorColocacao = 1.0) {
  return valorAposta * multiplicador * fatorColocacao;
}

// Formata número de telefone brasileiro
export function formatarTelefone(tel) {
  const n = tel.replace(/\D/g, '');
  if (n.length === 11) return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0,2)}) ${n.slice(2,6)}-${n.slice(6)}`;
  return tel;
}

// Formata CPF
export function formatarCPF(cpf) {
  const n = cpf.replace(/\D/g, '');
  if (n.length === 11) return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9)}`;
  return cpf;
}

// Gera QR Code PIX (simulado) - chave aleatória para demo
export function gerarPixPayload(valor, descricao) {
  const txid = gerarCodigo7();
  return {
    txid,
    qrcode: `00020126580014BR.GOV.BCB.PIX0136${txid}@zbixo.com.br5204000053039865406${valor.toFixed(2)}5802BR5913ZBIXO APOSTAS6009SAO PAULO62070503***6304`,
    copiaCola: `pix.zbixo.com.br/${txid}`,
    valor,
    descricao,
    expiracao: Date.now() + 30 * 60 * 1000, // 30 min
  };
}

// Agrupa apostas por data
export function agruparPorData(lista) {
  return lista.reduce((acc, item) => {
    const data = formatDate(item.data);
    if (!acc[data]) acc[data] = [];
    acc[data].push(item);
    return acc;
  }, {});
}

// Gera datas dos últimos N dias
export function ultimos7Dias() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('pt-BR');
  });
}
