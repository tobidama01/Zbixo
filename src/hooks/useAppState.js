// src/hooks/useAppState.js
import { useState, useEffect, useCallback } from 'react';

function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore errors */ }
  }, [key, state]);
  return [state, setState];
}

export function useAppState() {
  const [users, setUsers] = useLocalStorage('zbixo_users', []);
  const [currentUser, setCurrentUser] = useLocalStorage('zbixo_currentUser', null);
  const [apostas, setApostas] = useLocalStorage('zbixo_apostas', []);
  const [transacoes, setTransacoes] = useLocalStorage('zbixo_transacoes', []);
  const [resultados, setResultados] = useLocalStorage('zbixo_resultados', []);

  // Atualiza saldo do usuário atual
  const atualizarSaldo = useCallback((valor) => {
    if (!currentUser) return;
    const novoSaldo = (currentUser.saldo || 0) + valor;
    const userAtualizado = { ...currentUser, saldo: Math.max(0, novoSaldo) };
    setCurrentUser(userAtualizado);
    setUsers(prev => prev.map(u => u.cpf === currentUser.cpf ? userAtualizado : u));
    return Math.max(0, novoSaldo);
  }, [currentUser, setCurrentUser, setUsers]);

  // Registrar depósito PIX
  const registrarDeposito = useCallback((valor, txid) => {
    if (!currentUser) return;
    const transacao = {
      id: txid || `DEP-${Date.now()}`,
      tipo: 'deposito',
      valor,
      status: 'confirmado',
      data: new Date().toISOString(),
      userCpf: currentUser.cpf,
    };
    setTransacoes(prev => [transacao, ...prev]);
    atualizarSaldo(valor);
  }, [currentUser, setTransacoes, atualizarSaldo]);

  // Registrar saque
  const registrarSaque = useCallback((valor, chavePix, tipoChave) => {
    if (!currentUser) return { ok: false, msg: 'Usuário não autenticado' };
    const saldoAtual = currentUser.saldo || 0;
    const taxa = valor * 0.01;
    const totalDebitar = valor + taxa;
    if (saldoAtual < totalDebitar) return { ok: false, msg: 'Saldo insuficiente' };
    if (valor < 20) return { ok: false, msg: 'Saque mínimo é R$ 20,00' };
    if (valor > 5000) return { ok: false, msg: 'Saque máximo é R$ 5.000,00' };

    const transacao = {
      id: `SAQ-${Date.now()}`,
      tipo: 'saque',
      valor,
      taxa,
      chavePix,
      tipoChave,
      status: 'pendente',
      data: new Date().toISOString(),
      userCpf: currentUser.cpf,
    };
    setTransacoes(prev => [transacao, ...prev]);
    atualizarSaldo(-totalDebitar);
    return { ok: true, msg: 'Saque solicitado com sucesso!' };
  }, [currentUser, setTransacoes, atualizarSaldo]);

  // Registrar aposta
  const registrarAposta = useCallback((aposta) => {
    if (!currentUser) return { ok: false, msg: 'Não autenticado' };
    const saldoAtual = currentUser.saldo || 0;
    if (saldoAtual < aposta.valor) return { ok: false, msg: 'Saldo insuficiente' };

    const codigoAposta = `${Math.random().toString(36).substr(2,7).toUpperCase()}`;
    const novaAposta = {
      ...aposta,
      id: codigoAposta,
      codigo: codigoAposta,
      userCpf: currentUser.cpf,
      status: 'ativa',
      data: new Date().toISOString(),
    };
    setApostas(prev => [novaAposta, ...prev]);
    atualizarSaldo(-aposta.valor);
    return { ok: true, codigo: codigoAposta };
  }, [currentUser, setApostas, atualizarSaldo]);

  // Buscar apostas do usuário atual
  const apostasDoUsuario = currentUser
    ? apostas.filter(a => a.userCpf === currentUser.cpf)
    : [];

  // Buscar transações do usuário atual
  const transacoesDoUsuario = currentUser
    ? transacoes.filter(t => t.userCpf === currentUser.cpf)
    : [];

  return {
    users, setUsers,
    currentUser, setCurrentUser,
    apostas: apostasDoUsuario,
    transacoes: transacoesDoUsuario,
    resultados, setResultados,
    atualizarSaldo,
    registrarDeposito,
    registrarSaque,
    registrarAposta,
  };
}
