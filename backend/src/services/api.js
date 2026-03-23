// src/services/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('zbixo_token');
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro desconhecido');
  return data;
}

export const api = {
  // Auth
  login:    (cpf, senha)  => request('/auth/login',    { method: 'POST', body: JSON.stringify({ cpf, senha }) }),
  register: (dados)       => request('/auth/register', { method: 'POST', body: JSON.stringify(dados) }),

  // Usuário
  getMe: () => request('/users/me'),

  // Apostas
  apostar:      (dados)  => request('/apostas',      { method: 'POST', body: JSON.stringify(dados) }),
  getApostas:   ()       => request('/apostas'),

  // Pagamentos
  gerarPix:     (valor)  => request('/pagamentos/deposito', { method: 'POST', body: JSON.stringify({ valor }) }),
  solicitarSaque: (dados) => request('/pagamentos/saque',   { method: 'POST', body: JSON.stringify(dados) }),
  getTransacoes: ()      => request('/pagamentos/transacoes'),
};