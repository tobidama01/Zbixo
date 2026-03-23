// src/components/CalculadoraView.jsx
import React, { useState } from 'react';
import {
  Box, VStack, Text, Button, Input, Select, Divider, Flex
} from '@chakra-ui/react';
import AppHeader from './AppHeader';
import { MODALIDADES_LOTERIAS, COLOCACOES_LOTERIAS } from '../data/gameData';
import { formatBRL, calcularPremio } from '../utils/helpers';

function CalculadoraView({ onBack, onMenuOpen, currentUser }) {
  const [modalidadeId, setModalidadeId] = useState('centena');
  const [colocacaoId, setColocacaoId] = useState('1premio');
  const [valorAposta, setValorAposta] = useState(20);
  const [resultado, setResultado] = useState(null);
  const saldo = currentUser?.saldo || 0;

  const calcular = () => {
    const mod = MODALIDADES_LOTERIAS.find(m => m.id === modalidadeId);
    const col = COLOCACOES_LOTERIAS.find(c => c.id === colocacaoId);
    if (!mod || !col) return;
    const premio = calcularPremio(valorAposta, mod.multiplicador, col.fator);
    const cotacao = mod.multiplicador * col.fator;
    setResultado({ premio, cotacao });
  };

  return (
    <Box bg="white" w="100%" minH="100vh">
      <AppHeader title="MEGABIXO" saldo={saldo} onBack={onBack} onMenuOpen={onMenuOpen} />
      <Box p={4}>
        <Text fontWeight="bold" fontSize="xl" mb={1}>Calculadora de Prêmios</Text>
        <Text color="gray.600" fontSize="sm" mb={4}>Informe o valor da aposta e iremos calcular seu possível prêmio.</Text>
        <Divider mb={4} />

        <Text fontWeight="bold" mb={1}>Modalidade:</Text>
        <Select value={modalidadeId} onChange={e => { setModalidadeId(e.target.value); setResultado(null); }}
          mb={4} borderRadius="8px">
          {MODALIDADES_LOTERIAS.map(m => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </Select>

        <Text fontWeight="bold" mb={1}>Colocação:</Text>
        <Select value={colocacaoId} onChange={e => { setColocacaoId(e.target.value); setResultado(null); }}
          mb={4} borderRadius="8px">
          {COLOCACOES_LOTERIAS.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </Select>

        <Text fontWeight="bold" mb={1}>Valor da aposta:</Text>
        <Input
          value={`R$ ${valorAposta}`}
          onChange={e => {
            const n = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
            if (!isNaN(n)) setValorAposta(n);
          }}
          mb={4} borderRadius="8px"
          placeholder="R$ Aposta..."
        />

        {resultado && (
          <Box border="2px dashed" borderColor="gray.400" borderRadius="md" p={4} mb={4}>
            <Flex justify="space-between">
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">PRÊMIO</Text>
                <Text fontWeight="bold" fontSize="xl">{formatBRL(resultado.premio)}</Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="xs" color="gray.500" fontWeight="bold">COTAÇÃO</Text>
                <Text fontWeight="bold" fontSize="xl" color="gray.500">{formatBRL(resultado.cotacao)}</Text>
              </Box>
            </Flex>
          </Box>
        )}

        <Button w="full" bg="black" color="white" h="50px" fontSize="lg" onClick={calcular}>
          Calcular :)
        </Button>
      </Box>
    </Box>
  );
}

export default CalculadoraView;
