// src/components/TelaLogin.jsx
import React, { useState } from 'react';
import { VStack, Input, InputGroup, InputLeftElement, Button, Link, Text, Icon, useToast } from '@chakra-ui/react';
import { FaUser, FaLock } from 'react-icons/fa6';

function TelaLogin({ setView, users, onLoginSuccess }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const toast = useToast();

  const showMsg = (msg, status = 'error') => toast({
    title: msg, status, duration: 3000, isClosable: true, position: 'top',
  });

  const handleLogin = () => {
    const cpfClean = cpf.replace(/\D/g, '');
    if (!cpfClean || !senha) { showMsg('Preencha CPF e Senha.'); return; }
    const userFound = users.find(u => u.cpf.replace(/\D/g, '') === cpfClean && u.senha === senha);
    if (userFound) {
      onLoginSuccess(userFound);
      setCpf(''); setSenha('');
    } else {
      showMsg('CPF ou Senha incorretos.');
    }
  };

  return (
    <VStack spacing={4} w="100%" align="stretch">
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaUser} color="#A0AEC0" /></InputLeftElement>
        <Input variant="custom" placeholder="CPF ou CNPJ" value={cpf}
          onChange={e => setCpf(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />
      </InputGroup>
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaLock} color="#A0AEC0" /></InputLeftElement>
        <Input variant="custom" type="password" placeholder="Senha" value={senha}
          onChange={e => setSenha(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />
      </InputGroup>
      <Link color="white" fontSize="13px" alignSelf="flex-end" onClick={() => setView('recovery')}>
        Esqueceu sua senha?
      </Link>
      <Button bgGradient="linear(to-r, #2B6CB0, #4299E1)" color="white" onClick={handleLogin}>
        ENTRAR
      </Button>
      <Text color="white" fontSize="14px" textAlign="center">Primeiro acesso?</Text>
      <Button colorScheme="registerBtn" color="black" onClick={() => setView('register')}>
        CADASTRE-SE
      </Button>
    </VStack>
  );
}
export default TelaLogin;
