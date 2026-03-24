// src/components/ForceResetView.jsx
import React, { useState } from 'react';
import { VStack, Input, InputGroup, InputLeftElement, Button, Icon, Text } from '@chakra-ui/react';
import { FaLock } from 'react-icons/fa6';

function ForceResetView({ setView, setUsers, users, cpfToReset, showAlert }) {
  const [novaSenha, setNovaSenha] = useState(''); const [confirmaSenha, setConfirmaSenha] = useState('');

  const handleReset = () => {
    if (!novaSenha || !confirmaSenha) {
      showAlert('Por favor, preencha os dois campos.');
      return;
    }
    if (novaSenha.length < 6) {
      showAlert('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmaSenha) {
      showAlert('As senhas não correspondem.');
      return;
    }

    if (!cpfToReset) {
      showAlert('Sessão expirada. Por favor, faça o login novamente.');
      setView('login');
      return;
    }

    const userIndex = users.findIndex(user => user.cpf === cpfToReset);
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex].senha = novaSenha;
      updatedUsers[userIndex].mustResetPassword = false;
      setUsers(updatedUsers);

      showAlert('Senha alterada com sucesso! Faça o login.', 'success');
      setNovaSenha(''); setConfirmaSenha('');
      setTimeout(() => setView('login'), 2000);
    } else {
      showAlert('Erro ao encontrar usuário. Tente novamente.');
      setView('login');
    }
  };

  return (
    <VStack spacing={4} w="100%" align="stretch">
      <Text color="white" textAlign="center" lineHeight="1.5" mb="10px" fontSize="14px">
        Por segurança, crie uma nova senha para sua conta.
      </Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaLock} color="#A0AEC0" /></InputLeftElement>
        <Input variant="custom" type="password" placeholder="Nova Senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
      </InputGroup>
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaLock} color="#A0AEC0" /></InputLeftElement>
        <Input variant="custom" type="password" placeholder="Confirmar Nova Senha" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} />
      </InputGroup>
      <Button colorScheme="recoverBtn" color="black" onClick={handleReset}>
        Definir Nova Senha
      </Button>
    </VStack>
  );
}
export default ForceResetView;
