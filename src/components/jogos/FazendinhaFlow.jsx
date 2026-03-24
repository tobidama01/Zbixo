// src/components/jogos/FazendinhaFlow.jsx
import React, { useState } from 'react';
import {
  Box, Flex, VStack, HStack, Text, Button, Icon, Spacer,
  SimpleGrid, Image, Badge, Divider, useToast, Select
} from '@chakra-ui/react';
import AppHeader from '../AppHeader';
import { BICHOS, HORARIOS_EXTRACAO } from '../../data/gameData';
import { formatBRL } from '../../utils/helpers';

const TIPOS_FAZENDINHA = [
  { id: 'grupo', nome: 'GRUPO', mult: 21 },
  { id: 'dezena', nome: 'DEZENA', mult: 82 },
  { id: 'centena', nome: 'CENTENA', mult: 820 },
];

function FazendinhaFlow({ onBack, onMenuOpen, currentUser, registrarAposta }) {
  const [tipo, setTipo] = useState('grupo');
  const [loteria, setLoteria] = useState('');
  const [selecionados, setSelecionados] = useState([]);
  const [valor, setValor] = useState(1);
  const [passo, setPasso] = useState('selecionar');
  const toast = useToast();
  const saldo = currentUser?.saldo || 0;

  const tipoAtual = TIPOS_FAZENDINHA.find(t => t.id === tipo);

  const dezenas = Array.from({ length: 100 }, (_, i) => String(i).padStart(2, '0'));
  const centenas = Array.from({ length: 1000 }, (_, i) => String(i).padStart(3, '0'));

  const toggleItem = (item) => {
    setSelecionados(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const renderNumeros = () => {
    if (tipo === 'grupo') {
      return (
        <SimpleGrid columns={5} spacing={2} p={3}>
          {BICHOS.map(b => (
            <Box key={b.grupo}
              border="2px solid"
              borderColor={selecionados.includes(String(b.grupo).padStart(2, '0')) ? '#1A202C' : '#EDF2F7'}
              borderRadius="8px" overflow="hidden" cursor="pointer" bg="white"
              onClick={() => toggleItem(String(b.grupo).padStart(2, '0'))}>
              <Text textAlign="center" fontSize="12px" fontWeight="bold" pt={1}>{String(b.grupo).padStart(2,'0')}</Text>
              <Image src={b.img} alt={b.nome} w="100%" h="50px" objectFit="contain" p={1} />
            </Box>
          ))}
        </SimpleGrid>
      );
    }
    if (tipo === 'dezena') {
      return (
        <SimpleGrid columns={6} spacing={2} p={3}>
          {dezenas.map(n => (
            <Button key={n} size="sm" h="40px"
              bg={selecionados.includes(n) ? '#2D3748' : '#4A5568'}
              color="white" borderRadius="4px" onClick={() => toggleItem(n)} fontSize="13px">
              {n}
            </Button>
          ))}
        </SimpleGrid>
      );
    }
    if (tipo === 'centena') {
      return (
        <SimpleGrid columns={6} spacing={1} p={3}>
          {centenas.map(n => (
            <Button key={n} size="xs" h="32px"
              bg={selecionados.includes(n) ? '#2D3748' : '#4A5568'}
              color="white" borderRadius="4px" fontSize="10px" onClick={() => toggleItem(n)}>
              {n}
            </Button>
          ))}
        </SimpleGrid>
      );
    }
  };

  const handleAvancar = () => {
    if (selecionados.length === 0) {
      toast({ title: 'Selecione ao menos um número', status: 'warning', duration: 2000, position: 'top' });
      return;
    }
    setPasso('confirmar');
  };

  const handleFinalizar = () => {
    if (saldo < valor * selecionados.length) {
      toast({ title: 'Saldo insuficiente', status: 'error', duration: 2500, position: 'top' }); return;
    }
    const result = registrarAposta({
      tipo: 'fazendinha',
      descricao: `FAZENDINHA ${tipoAtual.nome}`,
      modalidadeNome: tipoAtual.nome,
      palpites: selecionados,
      valor: valor * selecionados.length,
      multiplicador: tipoAtual.mult,
      loteria,
    });
    if (result.ok) {
      toast({ title: `Aposta confirmada! Código: ${result.codigo}`, status: 'success', duration: 4000, position: 'top' });
      onBack();
    } else {
      toast({ title: result.msg, status: 'error', duration: 3000, position: 'top' });
    }
  };

  return (
    <Box bg="#F7FAFC" w="100%" minH="100vh">
      <AppHeader title="FAZENDINHA" saldo={saldo} onBack={onBack} onMenuOpen={onMenuOpen} />

      {passo === 'selecionar' && (
        <Box>
          <Box p={3} bg="white" mb={1}>
            <Select placeholder="TODAS LOTERIAS" value={loteria}
              onChange={e => setLoteria(e.target.value)} bg="#BEE3F8" fontSize="14px">
              {HORARIOS_EXTRACAO.map(h => (
                <option key={h.id} value={h.id}>{h.nome}</option>
              ))}
            </Select>
          </Box>

          <Box p={3} bg="white" mb={1}>
            <HStack justify="center" spacing={3} mb={3}>
              {TIPOS_FAZENDINHA.map(t => (
                <Button key={t.id} size="sm"
                  bg={tipo === t.id ? 'white' : 'transparent'}
                  border={tipo === t.id ? '2px solid #1A202C' : '1px solid #A0AEC0'}
                  onClick={() => { setTipo(t.id); setSelecionados([]); }}
                  fontSize="13px">
                  {t.nome}
                </Button>
              ))}
            </HStack>
            <HStack justify="center" spacing={2}>
              {[1, 2, 5, 10].map(v => (
                <Button key={v} size="sm"
                  bg={valor === v ? 'white' : '#EDF2F7'}
                  border={valor === v ? '2px solid #1A202C' : 'none'}
                  onClick={() => setValor(v)} fontSize="13px">
                  R$ {v},00
                </Button>
              ))}
            </HStack>
          </Box>

          {selecionados.length === 0 && (
            <Box p={3} bg="white" mb={1}>
              <Text fontSize="13px" color="#2B6CB0" fontWeight="bold">DEZENA</Text>
              <Text fontWeight="bold" fontSize="18px">R$ 1,00 pra R$ {tipoAtual.mult},00</Text>
              <Text fontSize="12px" color="#A0AEC0">LT NACIONAL 21HS - 20:55</Text>
              <Box h="2px" bg="#2B6CB0" mt={1} />
            </Box>
          )}

          <Box bg="white">
            <Flex p={3} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.100">
              <Text fontWeight="bold" fontSize="14px">FAZENDINHA</Text>
              <Text color="#E53E3E" fontWeight="bold" fontSize="14px">{tipoAtual.nome}</Text>
            </Flex>
            <Flex p={2} justify="space-between">
              <Text fontSize="13px">{selecionados.length} PALPITES</Text>
              <Text fontSize="13px" color="#A0AEC0">R$ 1,00 pra R$ {tipoAtual.mult},00</Text>
            </Flex>
            {renderNumeros()}
          </Box>

          <Box p={3}>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="14px">Total: <strong>{formatBRL(valor * Math.max(selecionados.length, 1))}</strong></Text>
            </Flex>
            <Button w="full" bg="#1A202C" color="white" h="50px" isDisabled={selecionados.length === 0}
              onClick={handleAvancar}>
              Comprar
            </Button>
          </Box>
        </Box>
      )}

      {passo === 'confirmar' && (
        <Box p={4}>
          <Box bg="white" p={4} borderRadius="md" border="1px solid" borderColor="#EDF2F7" mb={4}>
            <Text fontWeight="bold" fontSize="14px">FAZENDINHA {tipoAtual.nome}</Text>
            <Flex flexWrap="wrap" gap={2} mt={2}>
              {selecionados.map(s => (
                <Badge key={s} p={1} px={2} borderRadius="md" colorScheme="blackAlpha">{s}</Badge>
              ))}
            </Flex>
            <Flex mt={3} justify="space-between">
              <Text fontWeight="bold" fontSize="14px">{formatBRL(valor * selecionados.length)}</Text>
              <Text fontSize="13px" color="#A0AEC0">{formatBRL(valor)} / CADA</Text>
            </Flex>
          </Box>
          <Divider my={3} borderStyle="dashed" />
          <Text textAlign="center" fontWeight="bold" fontSize="18px" mb={4}>
            Total: {formatBRL(valor * selecionados.length)}
          </Text>
          <HStack>
            <Button flex={1} bg="#C9A058" color="white" onClick={() => setPasso('selecionar')}>Mais Apostas</Button>
            <Button flex={1} bg="#1A202C" color="white" onClick={handleFinalizar}>Confirmar</Button>
          </HStack>
        </Box>
      )}
    </Box>
  );
}

export default FazendinhaFlow;
