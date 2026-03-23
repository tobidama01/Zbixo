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

  // Busca: tenta encontrar no dicionário de sonhos primeiro, depois nos bichos
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
        <Text fontWeight="bold" fontSize="xl" mb={4}>Hoje sonhei com...</Text>
        <InputGroup mb={4}>
          <InputLeftElement>
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Ex: cobra, cachorro, dinheiro..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            borderRadius="full"
            bg="gray.50"
          />
        </InputGroup>

        {busca.length > 1 && resultados.length === 0 && bichosRelacionados.length === 0 && (
          <Text color="gray.500" textAlign="center" mt={8}>
            Nenhum resultado encontrado para "{busca}"
          </Text>
        )}

        {resultados.length > 0 && (
          <VStack align="stretch" spacing={3}>
            {resultados.map(r => (
              <Box key={r.termo} p={3} bg="blue.50" borderRadius="md">
                <Text fontWeight="bold" textTransform="capitalize">{r.termo}</Text>
                <Text fontSize="sm" color="gray.600">Números sugeridos:</Text>
                <SimpleGrid columns={6} spacing={2} mt={2}>
                  {r.numeros.map(n => (
                    <Badge key={n} textAlign="center" p={1} colorScheme="blue" fontSize="sm">{n}</Badge>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        )}

        {bichosRelacionados.length > 0 && (
          <VStack align="stretch" spacing={3} mt={resultados.length > 0 ? 4 : 0}>
            <Text fontWeight="bold" color="gray.600">Bichos relacionados:</Text>
            {bichosRelacionados.map(b => (
              <Box key={b.grupo} p={3} bg="gray.50" borderRadius="md">
                <Text fontWeight="bold">Grupo {b.grupo} - {b.nome}</Text>
                <SimpleGrid columns={4} spacing={2} mt={2}>
                  {b.dezenas.map(d => (
                    <Badge key={d} textAlign="center" p={1} colorScheme="blackAlpha">{d}</Badge>
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
