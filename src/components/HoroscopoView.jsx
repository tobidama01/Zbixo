// src/components/HoroscopoView.jsx
import React, { useState } from 'react';
import { Box, SimpleGrid, Text, Image, VStack, Badge, Divider } from '@chakra-ui/react';
import AppHeader from './AppHeader';
import { BICHOS } from '../data/gameData';

const SIGNOS = [
  { nome: 'Áries', emoji: '♈', numeros: ['17','18','19','20'], bicho: 5 },
  { nome: 'Touro', emoji: '♉', numeros: ['97','98','99','00'], bicho: 25 },
  { nome: 'Gêmeos', emoji: '♊', numeros: ['41','42','43','44'], bicho: 11 },
  { nome: 'Câncer', emoji: '♋', numeros: ['37','38','39','40'], bicho: 10 },
  { nome: 'Leão', emoji: '♌', numeros: ['61','62','63','64'], bicho: 16 },
  { nome: 'Virgem', emoji: '♍', numeros: ['45','46','47','48'], bicho: 12 },
  { nome: 'Libra', emoji: '♎', numeros: ['49','50','51','52'], bicho: 13 },
  { nome: 'Escorpião', emoji: '♏', numeros: ['33','34','35','36'], bicho: 9 },
  { nome: 'Sagitário', emoji: '♐', numeros: ['57','58','59','60'], bicho: 15 },
  { nome: 'Capricórnio', emoji: '♑', numeros: ['81','82','83','84'], bicho: 21 },
  { nome: 'Aquário', emoji: '♒', numeros: ['53','54','55','56'], bicho: 14 },
  { nome: 'Peixes', emoji: '♓', numeros: ['89','90','91','92'], bicho: 23 },
];

function HoroscopoView({ onBack, onMenuOpen, currentUser }) {
  const [selecionado, setSelecionado] = useState(null);
  const saldo = currentUser?.saldo || 0;

  if (selecionado) {
    const bicho = BICHOS.find(b => b.grupo === selecionado.bicho);
    return (
      <Box bg="white" w="100%" minH="100vh">
        <AppHeader title="HORÓSCOPO" saldo={saldo} onBack={() => setSelecionado(null)} onMenuOpen={onMenuOpen} />
        <Box p={4} textAlign="center">
          <Text fontSize="4xl">{selecionado.emoji}</Text>
          <Text fontWeight="bold" fontSize="xl" mt={2}>{selecionado.nome}</Text>
          <Divider my={4} />
          <Text fontWeight="bold" mb={2}>Números da sorte:</Text>
          <SimpleGrid columns={4} spacing={2} mb={4}>
            {selecionado.numeros.map(n => (
              <Badge key={n} p={2} colorScheme="blackAlpha" fontSize="lg" textAlign="center">{n}</Badge>
            ))}
          </SimpleGrid>
          {bicho && (
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold">Bicho relacionado:</Text>
              <Text>Grupo {bicho.grupo} - {bicho.nome}</Text>
              <Image src={bicho.img} alt={bicho.nome} h="60px" mx="auto" mt={2} />
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="white" w="100%" minH="100vh">
      <AppHeader title="HORÓSCOPO" saldo={saldo} onBack={onBack} onMenuOpen={onMenuOpen} />
      <Box p={4}>
        <Text fontWeight="bold" fontSize="lg" mb={4}>Qual é o seu signo?</Text>
        <SimpleGrid columns={3} spacing={3}>
          {SIGNOS.map(s => (
            <Box key={s.nome} border="1px solid" borderColor="gray.200" borderRadius="12px"
              p={3} textAlign="center" cursor="pointer" _hover={{ bg: 'gray.50' }}
              onClick={() => setSelecionado(s)}>
              <Text fontSize="2xl">{s.emoji}</Text>
              <Text fontSize="sm" fontWeight="medium" mt={1}>{s.nome}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default HoroscopoView;
