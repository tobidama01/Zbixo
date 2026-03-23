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

  // Gerar 80 números disponíveis (01-80)
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
      toast({ title: `✅ Aposta confirmada! Código: ${result.codigo}`, status: 'success', duration: 4000, position: 'top' });
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
          <Box p={4} borderBottom="1px solid" borderColor="gray.200">
            <Text fontWeight="bold" color="red.500">QUININHA</Text>
          </Box>
          <VStack spacing={0} align="stretch">
            {MODALIDADES_QUININHA.map(m => (
              <Flex key={m.id} p={4} borderBottom="1px solid" borderColor="gray.100"
                cursor="pointer" _hover={{ bg: 'gray.50' }}
                onClick={() => { setModalidade(m); setPasso('colocacao'); }} align="center">
                <Text fontWeight="medium">{m.nome}</Text>
                <Spacer />
                <Text color="blue.500" fontWeight="bold">{m.multiplicador.toLocaleString()}x</Text>
                <Icon as={FaArrowLeft} transform="rotate(180deg)" color="gray.400" ml={2} />
              </Flex>
            ))}
          </VStack>
        </Box>
      )}

      {passo === 'colocacao' && modalidade && (
        <Box>
          <Box p={4} borderBottom="1px solid" borderColor="gray.200">
            <Text fontWeight="bold">QUININHA</Text>
            <Text color="red.500" fontSize="sm">{modalidade.nome}</Text>
            <Text fontSize="sm" color="gray.500">{modalidade.minDig} RESTANTES · 0 PALPITES</Text>
          </Box>
          <VStack spacing={0} align="stretch">
            {COLOCACOES_LOTERIAS.slice(0, 10).map(c => (
              <Flex key={c.id} p={4} borderBottom="1px solid" borderColor="gray.100"
                cursor="pointer" _hover={{ bg: 'gray.50' }}
                onClick={() => { setColocacao(c); setPasso('numeros'); }} align="center">
                <Text fontWeight="medium">{c.nome}</Text>
                <Spacer />
                <Icon as={FaArrowLeft} transform="rotate(180deg)" color="gray.400" ml={2} />
              </Flex>
            ))}
          </VStack>
        </Box>
      )}

      {passo === 'numeros' && modalidade && colocacao && (
        <Box p={3}>
          <Box mb={3}>
            <Text fontWeight="bold">QUININHA</Text>
            <Text color="red.500" fontSize="sm">{modalidade.nome}</Text>
            <Text fontSize="sm">{modalidade.minDig - numeros.length} RESTANTES · {numeros.length} SELECIONADOS</Text>
          </Box>
          <SimpleGrid columns={8} spacing={2} mb={4}>
            {numDisp.map(n => (
              <Button key={n} size="sm" h="36px"
                bg={numeros.includes(n) ? 'black' : 'gray.100'}
                color={numeros.includes(n) ? 'white' : 'black'}
                borderRadius="full" onClick={() => toggleNum(n)} p={0} fontSize="xs">
                {n}
              </Button>
            ))}
          </SimpleGrid>
          <HStack>
            <Button flex={1} bg="gray.500" color="white" onClick={surpresinha}>Surpresinha</Button>
            <Button flex={1} bg={numeros.length >= modalidade.minDig ? 'black' : 'gray.300'}
              color="white" isDisabled={numeros.length < modalidade.minDig}
              onClick={() => setPasso('valor')}>Avançar</Button>
          </HStack>
        </Box>
      )}

      {passo === 'valor' && (
        <Box p={4}>
          <Box mb={3} bg="white" p={3} border="1px solid" borderColor="gray.200" borderRadius="md">
            <Text fontWeight="bold">{modalidade.nome} -</Text>
            <Box border="1px solid" borderColor="gray.300" borderRadius="md" p={2} my={2}>
              <Text fontSize="sm">{numeros.join('-')}</Text>
            </Box>
            <Flex justify="space-between">
              <Text fontWeight="bold">R$ {valor.toFixed(2)}</Text>
              <Text fontSize="sm" color="gray.500">{valor.toFixed(2)} / CADA</Text>
            </Flex>
          </Box>
          <Divider my={3} borderStyle="dashed" />
          <Text textAlign="center" fontWeight="bold" fontSize="lg" mb={4}>Total: {formatBRL(valor)}</Text>
          <Text fontSize="sm" color="blue.500" mb={2}>VER REGRAS DE ARREDONDAMENTO</Text>
          <Input value={valor} type="number" mb={3} onChange={e => setValor(Number(e.target.value))} />
          <HStack mb={4}>
            {[5, 10, 20, 50].map(v => (
              <Button key={v} size="sm" variant={valor === v ? 'solid' : 'outline'}
                onClick={() => setValor(v)}>+{v}</Button>
            ))}
          </HStack>
          <HStack>
            <Button flex={1} bg="#C09A53" color="white" onClick={() => setPasso('numeros')}>Mais Apostas</Button>
            <Button flex={1} bg="black" color="white" onClick={handleFinalizar}>Avançar</Button>
          </HStack>
        </Box>
      )}
    </Box>
  );
}

export default QuininhaFlow;
