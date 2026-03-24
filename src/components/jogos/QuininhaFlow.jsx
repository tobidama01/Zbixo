// src/components/jogos/QuininhaFlow.jsx
import React, { useState } from 'react';
import {
  Box, Flex, VStack, HStack, Text, Button, Icon, Spacer,
  SimpleGrid, Badge, Divider, useToast, Input
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa6';
import AppHeader from '../AppHeader';
import { MODALIDADES_QUININHA, COLOCACOES_LOTERIAS } from '../../data/gameData';
import { formatBRL } from '../../utils/helpers';

function QuininhaFlow({ onBack, onMenuOpen, currentUser, registrarAposta }) {
  const [passo, setPasso] = useState('modalidade');
  const [modalidade, setModalidade] = useState(null);
  const [colocacao, setColocacao] = useState(null);
  const [numeros, setNumeros] = useState([]);
  const [valor, setValor] = useState(20);
  const toast = useToast();
  const saldo = currentUser?.saldo || 0;

  const numDisp = Array.from({ length: 80 }, (_, i) => String(i + 1).padStart(2, '0'));

  const toggleNum = (n) => {
    if (numeros.includes(n)) {
      setNumeros(prev => prev.filter(x => x !== n));
    } else if (modalidade && numeros.length < modalidade.minDig) {
      setNumeros(prev => [...prev, n]);
    }
  };

  const surpresinha = () => {
    if (!modalidade) return;
    const shuffled = [...numDisp].sort(() => Math.random() - 0.5);
    setNumeros(shuffled.slice(0, modalidade.minDig));
  };

  const handleFinalizar = () => {
    if (!modalidade || !colocacao || numeros.length < modalidade.minDig) return;
    if (saldo < valor) {
      toast({ title: 'Saldo insuficiente', status: 'error', duration: 2500, position: 'top' }); return;
    }
    const result = registrarAposta({
      tipo: 'quininha',
      descricao: `${modalidade.nome} - ${colocacao.nome}`,
      modalidadeNome: modalidade.nome,
      colocacaoNome: colocacao.nome,
      palpites: [numeros.join('-')],
      valor,
      multiplicador: modalidade.multiplicador,
    });
    if (result.ok) {
      toast({ title: `Aposta confirmada! Código: ${result.codigo}`, status: 'success', duration: 4000, position: 'top' });
      onBack();
    } else {
      toast({ title: result.msg, status: 'error', duration: 3000, position: 'top' });
    }
  };

  return (
    <Box bg="white" w="100%" minH="100vh">
      <AppHeader title="QUININHA" saldo={saldo} onBack={onBack} onMenuOpen={onMenuOpen} />

      {passo === 'modalidade' && (
        <Box>
          <Box p={4} borderBottom="1px solid" borderColor="#EDF2F7">
            <Text fontWeight="bold" color="#E53E3E" fontSize="14px">QUININHA</Text>
          </Box>
          <VStack spacing={0} align="stretch">
            {MODALIDADES_QUININHA.map(m => (
              <Flex key={m.id} p={4} borderBottom="1px solid" borderColor="gray.100"
                cursor="pointer" _hover={{ bg: '#F7FAFC' }}
                onClick={() => { setModalidade(m); setPasso('colocacao'); }} align="center">
                <Text fontWeight="medium" fontSize="14px">{m.nome}</Text>
                <Spacer />
                <Text color="#2B6CB0" fontWeight="bold" fontSize="14px">{m.multiplicador.toLocaleString()}x</Text>
                <Icon as={FaArrowLeft} transform="rotate(180deg)" color="#A0AEC0" ml={2} />
              </Flex>
            ))}
          </VStack>
        </Box>
      )}

      {passo === 'colocacao' && modalidade && (
        <Box>
          <Box p={4} borderBottom="1px solid" borderColor="#EDF2F7">
            <Text fontWeight="bold" fontSize="14px">QUININHA</Text>
            <Text color="#E53E3E" fontSize="13px">{modalidade.nome}</Text>
            <Text fontSize="13px" color="#A0AEC0">{modalidade.minDig} RESTANTES · 0 PALPITES</Text>
          </Box>
          <VStack spacing={0} align="stretch">
            {COLOCACOES_LOTERIAS.slice(0, 10).map(c => (
              <Flex key={c.id} p={4} borderBottom="1px solid" borderColor="gray.100"
                cursor="pointer" _hover={{ bg: '#F7FAFC' }}
                onClick={() => { setColocacao(c); setPasso('numeros'); }} align="center">
                <Text fontWeight="medium" fontSize="14px">{c.nome}</Text>
                <Spacer />
                <Icon as={FaArrowLeft} transform="rotate(180deg)" color="#A0AEC0" ml={2} />
              </Flex>
            ))}
          </VStack>
        </Box>
      )}

      {passo === 'numeros' && modalidade && colocacao && (
        <Box p={3}>
          <Box mb={3}>
            <Text fontWeight="bold" fontSize="14px">QUININHA</Text>
            <Text color="#E53E3E" fontSize="13px">{modalidade.nome}</Text>
            <Text fontSize="13px">{modalidade.minDig - numeros.length} RESTANTES · {numeros.length} SELECIONADOS</Text>
          </Box>
          <SimpleGrid columns={8} spacing={2} mb={4}>
            {numDisp.map(n => (
              <Button key={n} size="sm" h="36px"
                bg={numeros.includes(n) ? '#1A202C' : '#EDF2F7'}
                color={numeros.includes(n) ? 'white' : 'black'}
                borderRadius="full" onClick={() => toggleNum(n)} p={0} fontSize="12px">
                {n}
              </Button>
            ))}
          </SimpleGrid>
          <HStack>
            <Button flex={1} bg="#4A5568" color="white" onClick={surpresinha}>Surpresinha</Button>
            <Button flex={1} bg={numeros.length >= modalidade.minDig ? '#1A202C' : '#EDF2F7'}
              color="white" isDisabled={numeros.length < modalidade.minDig}
              onClick={() => setPasso('valor')}>Avançar</Button>
          </HStack>
        </Box>
      )}

      {passo === 'valor' && (
        <Box p={4}>
          <Box mb={3} bg="white" p={3} border="1px solid" borderColor="#EDF2F7" borderRadius="md">
            <Text fontWeight="bold" fontSize="14px">{modalidade.nome} -</Text>
            <Box border="1px solid" borderColor="#EDF2F7" borderRadius="md" p={2} my={2}>
              <Text fontSize="13px">{numeros.join('-')}</Text>
            </Box>
            <Flex justify="space-between">
              <Text fontWeight="bold" fontSize="14px">R$ {valor.toFixed(2)}</Text>
              <Text fontSize="13px" color="#A0AEC0">{valor.toFixed(2)} / CADA</Text>
            </Flex>
          </Box>
          <Divider my={3} borderStyle="dashed" />
          <Text textAlign="center" fontWeight="bold" fontSize="18px" mb={4}>Total: {formatBRL(valor)}</Text>
          <Text fontSize="13px" color="#2B6CB0" mb={2}>VER REGRAS DE ARREDONDAMENTO</Text>
          <Input value={valor} type="number" mb={3} onChange={e => setValor(Number(e.target.value))} fontSize="14px" />
          <HStack mb={4}>
            {[5, 10, 20, 50].map(v => (
              <Button key={v} size="sm" variant={valor === v ? 'solid' : 'outline'}
                onClick={() => setValor(v)}>+{v}</Button>
            ))}
          </HStack>
          <HStack>
            <Button flex={1} bg="#C9A058" color="white" onClick={() => setPasso('numeros')}>Mais Apostas</Button>
            <Button flex={1} bg="#1A202C" color="white" onClick={handleFinalizar}>Avançar</Button>
          </HStack>
        </Box>
      )}
    </Box>
  );
}

export default QuininhaFlow;
