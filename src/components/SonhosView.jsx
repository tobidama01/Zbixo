// src/components/SonhosView.jsx
import React, { useState } from 'react';
import {
  Box, Text, Input, InputGroup, InputLeftElement, Icon,
  SimpleGrid, Badge, VStack
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import AppHeader from './AppHeader';
import { BICHOS, SONHOS } from '../data/gameData';

function SonhosView({ onBack, onMenuOpen, currentUser }) {
  const [busca, setBusca] = useState('');
  const saldo = currentUser?.saldo || 0;

  const resultados = busca.length > 1
    ? SONHOS.filter(s => s.termo.toLowerCase().includes(busca.toLowerCase()))
    : [];

  const bichosRelacionados = busca.length > 1
    ? BICHOS.filter(b =>
        b.nome.toLowerCase().includes(busca.toLowerCase()) ||
        b.dezenas.some(d => d.includes(busca))
      )
    : [];

  return (
    <Box bg="white" w="100%" minH="100vh">
      <AppHeader title="MEGABIXO" saldo={saldo} onBack={onBack} onMenuOpen={onMenuOpen} />
      <Box p={4}>
        <Text fontWeight="bold" fontSize="20px" mb={4}>Hoje sonhei com...</Text>
        <InputGroup mb={4}>
          <InputLeftElement>
            <Icon as={FaSearch} color="#A0AEC0" />
          </InputLeftElement>
          <Input
            placeholder="Ex: cobra, cachorro, dinheiro..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            borderRadius="full"
            bg="#F7FAFC"
            fontSize="14px"
          />
        </InputGroup>

        {busca.length > 1 && resultados.length === 0 && bichosRelacionados.length === 0 && (
          <Text color="#A0AEC0" textAlign="center" mt={8} fontSize="14px">
            Nenhum resultado encontrado para "{busca}"
          </Text>
        )}

        {resultados.length > 0 && (
          <VStack align="stretch" spacing={3}>
            {resultados.map(r => (
              <Box key={r.termo} p={3} bg="#BEE3F8" borderRadius="md">
                <Text fontWeight="bold" textTransform="capitalize" fontSize="14px">{r.termo}</Text>
                <Text fontSize="13px" color="#4A5568">Números sugeridos:</Text>
                <SimpleGrid columns={6} spacing={2} mt={2}>
                  {r.numeros.map(n => (
                    <Badge key={n} textAlign="center" p={1} colorScheme="blue" fontSize="13px">{n}</Badge>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        )}

        {bichosRelacionados.length > 0 && (
          <VStack align="stretch" spacing={3} mt={resultados.length > 0 ? 4 : 0}>
            <Text fontWeight="bold" color="#4A5568" fontSize="14px">Bichos relacionados:</Text>
            {bichosRelacionados.map(b => (
              <Box key={b.grupo} p={3} bg="#F7FAFC" borderRadius="md">
                <Text fontWeight="bold" fontSize="14px">Grupo {b.grupo} - {b.nome}</Text>
                <SimpleGrid columns={4} spacing={2} mt={2}>
                  {b.dezenas.map(d => (
                    <Badge key={d} textAlign="center" p={1} colorScheme="blackAlpha" fontSize="13px">{d}</Badge>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
}

export default SonhosView;
