// src/components/jogos/LoteriasFlow.jsx
import React, { useState } from 'react';
import {
  Box, Flex, VStack, HStack, Text, Button, Icon, Spacer,
  Input, InputGroup, SimpleGrid, Badge, Divider, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton
} from '@chakra-ui/react';
import { FaArrowLeft, FaBars, FaTrash, FaCheck, FaDice } from 'react-icons/fa6';
import AppHeader from '../AppHeader';
import { MODALIDADES_LOTERIAS, COLOCACOES_LOTERIAS, LOTERIAS } from '../../data/gameData';
import { formatBRL, calcularPremio } from '../../utils/helpers';

// Passo 1: Selecionar data/loteria
function PassoSelecionarData({ onSelect }) {
  const dias = ['HOJE', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO', 'DOMINGO'];
  const hoje = new Date();
  return (
    <Box p={4}>
      <Text fontWeight="bold" fontSize="xl" mb={4}>LOTERIAS</Text>
      <Divider mb={4} />
      <SimpleGrid columns={2} spacing={3}>
        {dias.map((dia, i) => {
          const d = new Date(hoje);
          d.setDate(hoje.getDate() + i);
          const num = String(d.getDate()).padStart(2, '0');
          return (
            <Button key={dia} bg="black" color="white" h="90px" borderRadius="12px"
              flexDir="column" gap={1} onClick={() => onSelect(d.toLocaleDateString('pt-BR'), dia)}>
              <Box bg="white" color="black" px={2} borderRadius="4px" fontSize="sm" fontWeight="bold">{num}</Box>
              <Text fontSize="sm">{dia}</Text>
            </Button>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

// Passo 2: Selecionar modalidade
function PassoModalidade({ data, onSelect }) {
  const [busca, setBusca] = useState('');
  const filtradas = MODALIDADES_LOTERIAS.filter(m =>
    m.nome.toLowerCase().includes(busca.toLowerCase())
  );
  return (
    <Box>
      <Box p={4} bg="white" borderBottom="1px solid" borderColor="gray.200">
        <Text fontWeight="bold">LOTERIAS</Text>
        <Text color="red.500" fontSize="sm">{data}</Text>
      </Box>
      <InputGroup p={3}>
        <Input placeholder="Pesquisar..." value={busca} onChange={e => setBusca(e.target.value)}
          borderRadius="8px" />
      </InputGroup>
      <VStack spacing={0} align="stretch">
        {filtradas.map(m => (
          <Flex key={m.id} p={4} borderBottom="1px solid" borderColor="gray.100"
            cursor="pointer" _hover={{ bg: 'gray.50' }} onClick={() => onSelect(m)} align="center">
            <Text fontWeight="medium">{m.nome}</Text>
            <Spacer />
            <Text color="blue.500" fontWeight="bold">{m.multiplicador.toLocaleString()}x</Text>
            <Icon as={FaArrowLeft} transform="rotate(180deg)" color="gray.400" ml={2} />
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

// Passo 3: Selecionar colocação
function PassoColocacao({ data, modalidade, onSelect }) {
  const [busca, setBusca] = useState('');
  const filtradas = COLOCACOES_LOTERIAS.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );
  return (
    <Box>
      <Box p={4} bg="white" borderBottom="1px solid" borderColor="gray.200">
        <Text fontWeight="bold">LOTERIAS</Text>
        <Text color="red.500" fontSize="sm">{modalidade.nome}</Text>
        <Text fontSize="sm">{data}</Text>
      </Box>
      <InputGroup p={3}>
        <Input placeholder="Pesquisar..." value={busca} onChange={e => setBusca(e.target.value)}
          borderRadius="8px" />
      </InputGroup>
      <VStack spacing={0} align="stretch">
        {filtradas.map(c => {
          const mult = Math.round(modalidade.multiplicador * c.fator);
          return (
            <Flex key={c.id} p={4} borderBottom="1px solid" borderColor="gray.100"
              cursor="pointer" _hover={{ bg: 'gray.50' }} onClick={() => onSelect(c)} align="center">
              <Text fontWeight="medium">{c.nome}</Text>
              <Spacer />
              {mult > 0 && <Text color="blue.500" fontWeight="bold">{mult.toLocaleString()}x</Text>}
              <Icon as={FaArrowLeft} transform="rotate(180deg)" color="gray.400" ml={2} />
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
}

// Passo 4: Preencher palpite
function PassoPalpite({ data, modalidade, colocacao, onAdd }) {
  const [palpite, setPalpite] = useState('');
  const [palpites, setPalpites] = useState([]);

  const maxDig = modalidade.digitos;

  const adicionarPalpite = () => {
    const p = palpite.trim();
    if (p.length !== maxDig) {
      return;
    }
    if (!palpites.includes(p)) {
      setPalpites(prev => [...prev, p]);
    }
    setPalpite('');
  };

  const surpresinha = () => {
    const chars = '0123456789';
    let rand = '';
    for (let i = 0; i < maxDig; i++) rand += chars[Math.floor(Math.random() * 10)];
    setPalpites(prev => [...new Set([...prev, rand])]);
  };

  const remover = (p) => setPalpites(prev => prev.filter(x => x !== p));

  const avancar = () => {
    if (palpites.length === 0) return;
    onAdd(palpites);
  };

  return (
    <Box p={4}>
      <Box mb={3}>
        <Text fontWeight="bold">LOTERIAS</Text>
        <Text color="red.500" fontSize="sm">{modalidade.nome}</Text>
        <Text fontSize="sm">{data}</Text>
        <Text fontSize="sm">{colocacao.nome}</Text>
        <Text fontSize="sm" color="gray.500">{palpites.length} PALPITES</Text>
      </Box>
      <InputGroup mb={3}>
        <Input
          placeholder="Palpite..."
          value={palpite}
          onChange={e => setPalpite(e.target.value.replace(/\D/g, '').slice(0, maxDig))}
          onKeyDown={e => e.key === 'Enter' && adicionarPalpite()}
          maxLength={maxDig}
        />
      </InputGroup>
      {palpites.length > 0 && (
        <Flex flexWrap="wrap" gap={2} mb={3}>
          {palpites.map(p => (
            <Badge key={p} p={2} borderRadius="md" colorScheme="blackAlpha" cursor="pointer"
              onClick={() => remover(p)}>
              {p} ✕
            </Badge>
          ))}
        </Flex>
      )}
      <HStack>
        <Button flex={1} bg="gray.600" color="white" onClick={surpresinha}>Surpresinha</Button>
        <Button flex={1} bg={palpites.length > 0 ? 'black' : 'gray.300'} color="white"
          onClick={avancar} isDisabled={palpites.length === 0}>
          Avançar
        </Button>
      </HStack>
    </Box>
  );
}

// Passo 5: Definir valor
function PassoValor({ data, modalidade, colocacao, palpites, onConfirm }) {
  const [valor, setValor] = useState(20);
  const [modo, setModo] = useState('cada'); // 'todos' ou 'cada'

  const quickValues = [5, 10, 20, 50];
  const totalValor = modo === 'cada' ? valor * palpites.length : valor;
  const premio = calcularPremio(
    modo === 'cada' ? valor : valor / palpites.length,
    modalidade.multiplicador, colocacao.fator
  );

  return (
    <Box p={4}>
      <Box mb={3}>
        <Text fontWeight="bold">LOTERIAS — {modalidade.nome}</Text>
        <Text fontSize="sm" color="gray.600">{data} · {colocacao.nome} · {palpites.length} palpites</Text>
      </Box>
      <Text fontSize="sm" color="blue.500" mb={2}>VER REGRAS DE ARREDONDAMENTO</Text>
      <InputGroup mb={3}>
        <Input
          value={`R$ ${valor.toFixed(2)}`}
          onChange={e => {
            const n = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
            if (!isNaN(n)) setValor(n);
          }}
          borderRadius="8px"
        />
        <Button position="absolute" right={2} top="50%" transform="translateY(-50%)"
          size="sm" variant="ghost" onClick={() => setValor(0)}>Limpar</Button>
      </InputGroup>
      <Text fontSize="sm" fontWeight="bold" mb={2}>Valores rápidos:</Text>
      <HStack mb={4}>
        {quickValues.map(v => (
          <Button key={v} size="sm" variant={valor === v ? 'solid' : 'outline'}
            colorScheme={valor === v ? 'blackAlpha' : 'gray'}
            onClick={() => setValor(v)}>+{v}</Button>
        ))}
      </HStack>
      <HStack>
        <Button flex={1} bg={modo === 'todos' ? 'black' : 'white'} color={modo === 'todos' ? 'white' : 'black'}
          border="1px solid black" onClick={() => setModo('todos')}>Todos</Button>
        <Button flex={1} bg={modo === 'cada' ? 'black' : 'white'} color={modo === 'cada' ? 'white' : 'black'}
          border="1px solid black" onClick={() => setModo('cada')}>Cada</Button>
      </HStack>
      <Box mt={4} p={3} bg="gray.50" borderRadius="md">
        <Text fontSize="sm">Prêmio estimado (1 palpite): <strong>{formatBRL(premio)}</strong></Text>
        <Text fontSize="sm">Total: <strong>{formatBRL(totalValor)}</strong></Text>
      </Box>
      <Button mt={4} w="full" bg="black" color="white"
        onClick={() => onConfirm({ valor: totalValor, valorPorPalpite: modo === 'cada' ? valor : valor / palpites.length, modo })}>
        Avançar
      </Button>
    </Box>
  );
}

// Passo 6: Resumo e confirmação
function PassoResumo({ data, modalidade, colocacao, palpites, valorInfo, onFinalizar, onBack, saldo }) {
  const toast = useToast();
  const nomeAposta = `${modalidade.nome} - ${colocacao.nome}`;

  const confirmar = () => {
    if (saldo < valorInfo.valor) {
      toast({ title: 'Saldo insuficiente', status: 'error', duration: 2500, position: 'top' });
      return;
    }
    onFinalizar({
      tipo: 'loterias',
      descricao: nomeAposta,
      modalidade: modalidade.id,
      modalidadeNome: modalidade.nome,
      colocacao: colocacao.id,
      colocacaoNome: colocacao.nome,
      palpites,
      data,
      valor: valorInfo.valor,
      multiplicador: modalidade.multiplicador,
      fatorColocacao: colocacao.fator,
    });
  };

  return (
    <Box p={4}>
      <Box bg="white" p={4} borderRadius="md" border="1px solid" borderColor="gray.200" mb={4}>
        <Text fontWeight="bold">{nomeAposta}</Text>
        <Flex flexWrap="wrap" gap={2} mt={2}>
          {palpites.map(p => (
            <Badge key={p} p={1} px={2} borderRadius="md" border="1px solid" borderColor="gray.400">
              {p}
            </Badge>
          ))}
        </Flex>
        <Flex mt={3} justify="space-between">
          <Text fontWeight="bold">{formatBRL(valorInfo.valor)}</Text>
          <Text fontSize="sm" color="gray.500">{formatBRL(valorInfo.valorPorPalpite)} / CADA</Text>
        </Flex>
      </Box>
      <Divider my={3} borderStyle="dashed" />
      <Flex justify="center" mb={4}>
        <Text fontWeight="bold" fontSize="lg">Total: {formatBRL(valorInfo.valor)}</Text>
      </Flex>
      <HStack>
        <Button flex={1} bg="#C09A53" color="white" onClick={onBack}>Mais Apostas</Button>
        <Button flex={1} bg="black" color="white" onClick={confirmar}>Avançar</Button>
      </HStack>
    </Box>
  );
}

// Componente principal do fluxo
function LoteriasFlow({ onMenuOpen, currentUser, registrarAposta }) {
  const [passo, setPasso] = useState('data');
  const [dataSel, setDataSel] = useState('');
  const [modalidade, setModalidade] = useState(null);
  const [colocacao, setColocacao] = useState(null);
  const [palpites, setPalpites] = useState([]);
  const [valorInfo, setValorInfo] = useState(null);
  const toast = useToast();

  const saldo = currentUser?.saldo || 0;

  const handleFinalizar = (aposta) => {
    const result = registrarAposta(aposta);
    if (result.ok) {
      toast({
        title: `✅ Aposta confirmada! Código: ${result.codigo}`,
        status: 'success', duration: 4000, position: 'top', isClosable: true,
      });
      setPasso('data');
      setDataSel('');
      setModalidade(null);
      setColocacao(null);
      setPalpites([]);
    } else {
      toast({ title: result.msg, status: 'error', duration: 3000, position: 'top' });
    }
  };

  const renderPasso = () => {
    switch (passo) {
      case 'data':
        return <PassoSelecionarData
          onSelect={(d) => { setDataSel(d); setPasso('modalidade'); }}
        />;
      case 'modalidade':
        return <PassoModalidade data={dataSel}
          onSelect={m => { setModalidade(m); setPasso('colocacao'); }}
          onBack={() => setPasso('data')} />;
      case 'colocacao':
        return <PassoColocacao data={dataSel} modalidade={modalidade}
          onSelect={c => { setColocacao(c); setPasso('palpite'); }}
          onBack={() => setPasso('modalidade')} />;
      case 'palpite':
        return <PassoPalpite data={dataSel} modalidade={modalidade} colocacao={colocacao}
          onAdd={ps => { setPalpites(ps); setPasso('valor'); }}
          onBack={() => setPasso('colocacao')} />;
      case 'valor':
        return <PassoValor data={dataSel} modalidade={modalidade} colocacao={colocacao}
          palpites={palpites}
          onConfirm={vi => { setValorInfo(vi); setPasso('resumo'); }}
          onBack={() => setPasso('palpite')} />;
      case 'resumo':
        return <PassoResumo data={dataSel} modalidade={modalidade} colocacao={colocacao}
          palpites={palpites} valorInfo={valorInfo} saldo={saldo}
          onFinalizar={handleFinalizar}
          onBack={() => setPasso('valor')} />;
      default:
        return null;
    }
  };

  return (
    <Box bg="white" w="100%" minH="100vh">
      <AppHeader
        title={passo === 'data' ? 'LOTERIAS' : passo === 'modalidade' ? 'MODALIDADE' :
          passo === 'colocacao' ? 'COLOCAÇÕES' : passo === 'palpite' ? 'PREENCHA SEU PALPITE' :
          passo === 'valor' ? 'ESCOLHA O VALOR' : 'APOSTAS'}
        saldo={saldo}
        onBack={() => {
          const steps = ['data','modalidade','colocacao','palpite','valor','resumo'];
          const i = steps.indexOf(passo);
          if (i > 0) setPasso(steps[i - 1]);
        }}
        onMenuOpen={onMenuOpen}
      />
      {renderPasso()}
    </Box>
  );
}

export default LoteriasFlow;
