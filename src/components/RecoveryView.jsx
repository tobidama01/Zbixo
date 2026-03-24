// src/components/RecoveryView.jsx
import React, { useState } from 'react';
import { VStack, Input, InputGroup, InputLeftElement, Button, Link, Icon, Text } from '@chakra-ui/react';
import { FaUser, FaArrowLeft } from 'react-icons/fa6';

function RecoveryView({ setView, setUsers, users, showAlert }) {
  const [cpf, setCpf] = useState('');

  const handleRecovery = () => {
    if (!cpf) {
      showAlert('Por favor, informe seu CPF ou CNPJ.');
      return;
    }
    const userIndex = users.findIndex(user => user.cpf === cpf);
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex].senha = '123456';
      updatedUsers[userIndex].mustResetPassword = true;
      setUsers(updatedUsers);

      showAlert('Senha redefinida! Use "123456" para entrar.', 'success');
      setCpf('');
      setTimeout(() => setView('login'), 2000);
    } else {
      showAlert('CPF ou CNPJ não encontrado.');
    }
  };

  return (
    <VStack spacing={4} w="100%" align="stretch">
      <Text color="white" textAlign="center" lineHeight="1.5" mb="10px" fontSize="14px">
        Informe o seu CPF ou CNPJ e definiremos uma senha provisória para você.
      </Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none"><Icon as={FaUser} color="#A0AEC0" /></InputLeftElement>
        <Input variant="custom" placeholder="CPF ou CNPJ" value={cpf} onChange={(e) => setCpf(e.target.value)} />
      </InputGroup>
      <Button colorScheme="recoverBtn" color="black" onClick={handleRecovery}>
        Recuperar senha
      </Button>
      <Link color="white" fontSize="16px" display="flex" alignItems="center" justifyContent="center" onClick={() => setView('login')}>
        <Icon as={FaArrowLeft} mr="8px" /> Voltar
      </Link>
    </VStack>
  );
}
export default RecoveryView;
