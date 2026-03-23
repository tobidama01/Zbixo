// src/components/DashboardView.jsx
import React, { useState } from 'react';
import {
  Box, Flex, VStack, Text, Image, Button, Icon,
  SimpleGrid, Divider, Spacer, Heading, Badge
} from '@chakra-ui/react';
import {
  FaHouse, FaUsers, FaBars, FaEye, FaEyeSlash,
  FaFileLines, FaArrowsUpDown, FaCalculator
} from 'react-icons/fa6';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { SiPix } from 'react-icons/si';
import { formatBRL } from '../utils/helpers';

// Ícone customizado Resultados
const IconResultados = (props) => (
  <Icon viewBox="0 0 24 24" fill="white" {...props}>
    <path d="M3.548,20.922h16.9a.5.5,0,0,0,0-1H3.548a.5.5,0,0,0,0,1Z"/>
    <path d="M9,18.919H6.565a2.5,2.5,0,0,1-2.5-2.5V5.578a2.5,2.5,0,0,1,2.5-2.5H9a2.5,2.5,0,0,1,2.5,2.5V16.419A2.5,2.5,0,0,1,9,18.919ZM6.565,4.078a1.5,1.5,0,0,0-1.5,1.5V16.419a1.5,1.5,0,0,0,1.5,1.5H9a1.5,1.5,0,0,0,1.5-1.5V5.578A1.5,1.5,0,0,0,9,4.078Z"/>
    <path d="M17.437,18.919H15a2.5,2.5,0,0,1-2.5-2.5V10.55A2.5,2.5,0,0,1,15,8.05h2.434a2.5,2.5,0,0,1,2.5,2.5v5.869A2.5,2.5,0,0,1,17.437,18.919ZM15,9.05a1.5,1.5,0,0,0-1.5,1.5v5.869a1.5,1.5,0,0,0,1.5,1.5h2.434a1.5,1.5,0,0,0,1.5-1.5V10.55a1.5,1.5,0,0,0-1.5-1.5Z"/>
  </Icon>
);

// Ícone customizado Premiadas (Trophy)
const IconPremiadas = (props) => (
  <Icon viewBox="0 0 24 24" fill="white" {...props}>
    <g id="Trophy">
      <path d="M19.435,5.055h-.97c.01-.12.02-.24.02-.36a1.645,1.645,0,0,0-.45-1.18,1.462,1.462,0,0,0-1.05-.45H7.025a1.484,1.484,0,0,0-1.06.45,1.6,1.6,0,0,0-.44,1.18c0,.12.01.24.02.36h-.98a1.5,1.5,0,0,0-1.5,1.5v2a4.5,4.5,0,0,0,4.27,4.49c1.07,2.3,2.53,3.79,4.17,4.04v2.85h-4a.5.5,0,1,0,0,1h9a.5.5,0,0,0,0-1h-4v-2.85c1.64-.25,3.1-1.74,4.17-4.04a4.493,4.493,0,0,0,4.26-4.49v-2A1.5,1.5,0,0,0,19.435,5.055Zm-15.37,3.5v-2a.5.5,0,0,1,.5-.5h1.04a22.9,22.9,0,0,0,1.28,5.93A3.5,3.5,0,0,1,4.065,8.555Zm7.94,7.57c-2.82,0-5.23-5.04-5.48-11.47a.573.573,0,0,1,.16-.44.48.48,0,0,1,.34-.15h9.96a.442.442,0,0,1,.33.15.62.62,0,0,1,.17.44C17.235,11.085,14.825,16.125,12.005,16.125Zm7.93-7.57a3.508,3.508,0,0,1-2.8,3.42,23.353,23.353,0,0,0,1.27-5.92h1.03a.5.5,0,0,1,.5.5Z"/>
    </g>
  </Icon>
);

// Ícone customizado Relatórios (View_Timeline)
const IconRelatorios = (props) => (
  <Icon viewBox="0 0 24 24" fill="white" {...props}>
    <g id="View_Timeline">
      <g>
        <path d="M18.436,20.94H5.562a2.5,2.5,0,0,1-2.5-2.5V5.567a2.5,2.5,0,0,1,2.5-2.5H18.436a2.5,2.5,0,0,1,2.5,2.5V18.44A2.5,2.5,0,0,1,18.436,20.94ZM5.562,4.067a1.5,1.5,0,0,0-1.5,1.5V18.44a1.5,1.5,0,0,0,1.5,1.5H18.436a1.5,1.5,0,0,0,1.5-1.5V5.567a1.5,1.5,0,0,0-1.5-1.5Z"/>
        <path d="M6.544,8.287h0a.5.5,0,0,1,0-1H12a.5.5,0,0,1,0,1Z"/>
        <path d="M9.271,12.5h0a.5.5,0,0,1,0-1h5.454a.5.5,0,0,1,0,1Z"/>
        <path d="M12,16.724h0a.5.5,0,0,1,0-1h5.455a.5.5,0,0,1,0,1Z"/>
      </g>
    </g>
  </Icon>
);

const DashButton = ({ icon, text, colorScheme = 'blackBtn', onClick, height = "100px" }) => (
  <Button colorScheme={colorScheme} color="white" height={height} borderRadius="24px" onClick={onClick}>
    <VStack spacing={2}>
      <Icon as={icon} boxSize={8} />
      <Text fontSize="md">{text}</Text>
    </VStack>
  </Button>
);

function DashboardView({ currentUser, onMenuOpen, setAppView }) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const saldo = currentUser?.saldo || 0;

  return (
    <Box bg="#f0f2f5" w="100%" minH="100vh" color="black">
      <Flex as="header" align="center" p={4} bg="black" color="white">
        <Icon as={FaHouse} boxSize={6} cursor="pointer" onClick={() => setAppView('dashboard')} />
        <Spacer />
        <Heading size="md">ZBIXO</Heading>
        <Spacer />
        <Icon as={FaBars} boxSize={6} onClick={onMenuOpen} cursor="pointer" />
      </Flex>

      <Box p={4} bg="white">
        <Flex justify="center" mb={2}>
          <Badge colorScheme="teal" variant="subtle" borderRadius="md" p={1} px={2} fontSize="0.8em"
            boxShadow="0 0 5px rgba(20,184,166,0.7)">
            UNIDADE {currentUser?.unidade || '#00000'}
          </Badge>
        </Flex>
        <Flex align="center" justify="space-between">
          <Text fontWeight="bold" fontSize="xl">Saldo</Text>
          <Icon as={balanceVisible ? FaEyeSlash : FaEye} boxSize={5} mx={2} cursor="pointer"
            onClick={() => setBalanceVisible(v => !v)} />
          <Spacer />
          <Text fontWeight="bold" fontSize="xl">
            {balanceVisible ? formatBRL(saldo) : 'R$ ****,**'}
          </Text>
        </Flex>
      </Box>

      <Divider borderColor="#000080" borderWidth="2px" />

      <VStack spacing={4} p={3} align="stretch">
       <SimpleGrid columns={2} spacing={4}>
  <Box
    h="186px" borderRadius="24px" overflow="hidden"
    cursor="pointer" onClick={() => setAppView('tipoDeJogo')}>
    <Image src="/img/LOTERIAS.png" alt="Loterias"
      h="100%" w="100%" objectFit="cover" />
  </Box>
  <Box
    h="186px" borderRadius="24px" overflow="hidden"
    cursor="pointer" onClick={() => setAppView('fazendinha')}>
    <Image src="/img/FAZENDINHA2.png" alt="Fazendinha"
      h="100%" w="100%" objectFit="cover" />
  </Box>

  <Box h="154px" borderRadius="24px" overflow="hidden" cursor="pointer" bg="#C09A53">
    <Flex h="100%" align="center" justify="center" direction="column" gap={1}>
      <Icon as={FaUsers} color="white" boxSize={8} />
      <Text color="white" fontWeight="bold" fontSize="sm">PROMOTOR</Text>
    </Flex>
  </Box>
  <DashButton icon={FaUsers} text="Amigos (R$/%)" colorScheme="blackBtn" height="154px" />
</SimpleGrid>

        <Button
          bg="rgb(0, 183, 181)" color="white" height="120px" borderRadius="24px"
          border="1px solid white" opacity={0.9}
          leftIcon={<Icon as={SiPix} boxSize={9} />}
          _hover={{ opacity: 1 }}
          onClick={() => setAppView('recargaPix')}>
          Recarga PIX
        </Button>

        <Button bg="#000080" color="white" height="60px" borderRadius="16px"
          leftIcon={<Icon as={IoLogoWhatsapp} boxSize={6} />}
          _hover={{ bg: '#000066' }}>
          Grupo do promotor
        </Button>

        <SimpleGrid columns={2} spacing={4}>
          <DashButton icon={IconResultados} text="Resultados" height="120px"  onClick={() => setAppView('resultados')} />
          <DashButton icon={SiPix}          text="Saques" height="120px"     colorScheme="tealGreen" onClick={() => setAppView('saque')} />
          <DashButton icon={IconPremiadas}  text="Premiadas" height="120px"  onClick={() => setAppView('premiadas')} />
          <DashButton icon={IconRelatorios} text="Relatórios" height="120px"  onClick={() => setAppView('relatorios')} />
        </SimpleGrid>
      </VStack>

      <Divider borderColor="#000080" borderWidth="2px" />
      <Text p={4} textAlign="center" color="gray.500" fontSize="sm">© 2026 ZBIXO</Text>
    </Box>
  );
}

export default DashboardView;