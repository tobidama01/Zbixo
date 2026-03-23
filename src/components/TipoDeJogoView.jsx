// src/components/TipoDeJogoView.jsx
import React from 'react';
import {
  Box, Flex, VStack, Text, Image, Button, Icon,
  SimpleGrid, Spacer, Heading
} from '@chakra-ui/react';
import {
  FaHouse, FaBars, FaMoon, FaCalculator, FaDog,
  FaArrowsRotate, FaStar, FaClockRotateLeft
} from 'react-icons/fa6';
import AppHeader from './AppHeader';

const ListButton = ({ icon, text, colorScheme = 'blackBtn', onClick }) => (
  <Button colorScheme={colorScheme} color="white" height="60px" borderRadius="0px"
    justifyContent="flex-start" pl={6} leftIcon={<Icon as={icon} boxSize={6} />} onClick={onClick}>
    <Text fontSize="lg">{text}</Text>
  </Button>
);

const GameCard = ({ imageSrc, altText, fitMode = 'cover', onClick, h }) => (
  <Box
    bg="white" border="2px solid" borderColor="#000080" borderRadius="0px"
    overflow="hidden" cursor="pointer"
    h={h} w="100%"
    display="flex" alignItems="center" justifyContent="center" onClick={onClick}
    _hover={{ borderColor: '#C09A53', transform: 'scale(1.02)', transition: '0.2s' }}>
    <Image src={imageSrc} alt={altText} h="100%" w="100%" objectFit={fitMode} />
  </Box>
);

function TipoDeJogoView({ setAppView, onMenuOpen, currentUser }) {
  const saldo = currentUser?.saldo || 0;

  return (
    <Box bg="#f0f2f5" w="100%" minH="100vh" color="black">
      <AppHeader title="TIPO DE JOGO" saldo={saldo}
        onBack={() => setAppView('dashboard')} onMenuOpen={onMenuOpen} />

      <VStack spacing={3} p={3} align="stretch">

        {/* Botão Repetir Pule — quadrado/retangular como na referência */}
        <Button
          colorScheme="blackBtn" color="white" height="56px" borderRadius="12px"
          leftIcon={<Icon as={FaArrowsRotate} />}>
          REPETIR PULE
        </Button>

        {/* Linha 1: Loterias (197px) + Quininha (197px) */}
        <SimpleGrid columns={2} spacing={3}>
          <GameCard
            imageSrc="/img/LOTERIAS.png" altText="Loterias"
            fitMode="cover" h="197px"
            onClick={() => setAppView('loterias')}
          />
          <GameCard
            imageSrc="/img/QUININHA.png" altText="Quininha"
            fitMode="contain" h="197px"
            onClick={() => setAppView('quininha')}
          />
        </SimpleGrid>

        {/* Linha 2: Seninha (153px) + Lotinha (153px) */}
        <SimpleGrid columns={2} spacing={3}>
          <GameCard
            imageSrc="/img/SENINHA.png" altText="Seninha"
            fitMode="contain" h="153px"
          />
          <GameCard
            imageSrc="/img/LOTINHA.png" altText="Lotinha"
            fitMode="contain" h="153px"
          />
        </SimpleGrid>

        <VStack spacing={1} align="stretch">
          <ListButton icon={FaMoon}            text="Sonhos"           onClick={() => setAppView('sonhos')} />
          <ListButton icon={FaStar}            text="Horóscopo"        colorScheme="tealGreen" onClick={() => setAppView('horoscopo')} />
          <ListButton icon={FaCalculator}      text="Calculadora"      onClick={() => setAppView('calculadora')} />
          <ListButton icon={FaClockRotateLeft} text="Atrasados"        colorScheme="tealGreen" onClick={() => setAppView('atrasados')} />
          <ListButton icon={FaDog}             text="Tabela de Bichos" onClick={() => setAppView('tabelaBichos')} />
        </VStack>

      </VStack>
    </Box>
  );
}

export default TipoDeJogoView;