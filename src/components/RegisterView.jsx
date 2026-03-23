// src/components/RegisterView.jsx
import React, { useState } from 'react';
import { VStack, Input, InputGroup, InputLeftElement, Button, Link, Icon, useToast } from '@chakra-ui/react';
import { FaUser, FaWhatsapp, FaLock, FaArrowLeft, FaFileLines, FaCalendar } from 'react-icons/fa6';
import { validarCPF, validarIdade, gerarUnidade, gerarCodigo7 } from '../utils/helpers';

function RegisterView({ setView, setUsers, users }) {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [senha, setSenha] = useState('');
  const toast = useToast();

  const showMsg = (msg, status = 'error') => toast({
    title: msg, status, duration: 3500, isClosable: true, position: 'top',
  });

  const handleRegister = () => {
    if (!nome || !whatsapp || !cpf || !senha || !dataNasc) {
      showMsg('Preencha todos os campos.'); return;
    }
    const nomeParts = nome.trim().split(' ');
    if (nomeParts.length < 2 || nomeParts.some(p => p.length < 2)) {
      showMsg('Digite seu nome completo (nome e sobrenome).'); return;
    }
    const cpfClean = cpf.replace(/\D/g, '');
    if (!validarCPF(cpfClean)) {
      showMsg('CPF inválido. Verifique os números.'); return;
    }
    if (!validarIdade(dataNasc)) {
      showMsg('Você precisa ter 18 anos ou mais para se cadastrar.'); return;
    }
    if (users.find(u => u.cpf.replace(/\D/g, '') === cpfClean)) {
      showMsg('CPF já cadastrado.'); return;
    }

    const novoUser = {
      nome, whatsapp, cpf: cpfClean, dataNasc, senha,
      unidade: gerarUnidade(),
      codigo: gerarCodigo7(),
      saldo: 0,
      mustResetPassword: false,
      criadoEm: new Date().toISOString(),
    };
    setUsers(prev => [...prev, novoUser]);
    showMsg('Cadastro realizado! Faça login.', 'success');
    setNome(''); setWhatsapp(''); setCpf(''); setDataNasc(''); setSenha('');
    setView('login');
  };

  return (
    <VStack spacing={4} w="100%" align="stretch">
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaFileLines} color="gray.400" /></InputLeftElement>
        <Input variant="custom" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} />
      </InputGroup>
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaWhatsapp} color="gray.400" /></InputLeftElement>
        <Input variant="custom" placeholder="WhatsApp (com DDD)" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
      </InputGroup>
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaUser} color="gray.400" /></InputLeftElement>
        <Input variant="custom" placeholder="CPF (somente números)" value={cpf} onChange={e => setCpf(e.target.value)} maxLength={14} />
      </InputGroup>
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaCalendar} color="gray.400" /></InputLeftElement>
        <Input variant="custom" type="date" placeholder="Data de nascimento" value={dataNasc} onChange={e => setDataNasc(e.target.value)} />
      </InputGroup>
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaLock} color="gray.400" /></InputLeftElement>
        <Input variant="custom" type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
      </InputGroup>
      <Button colorScheme="submitBtn" color="black" onClick={handleRegister}>CADASTRAR</Button>
      <Link color="white" fontSize="1.1em" display="flex" alignItems="center" justifyContent="center" onClick={() => setView('login')}>
        <Icon as={FaArrowLeft} mr="8px" /> Voltar
      </Link>
    </VStack>
  );
}
export default RegisterView;
