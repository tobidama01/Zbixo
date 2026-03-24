// src/components/MenuDrawer.jsx
import React from 'react';
import {
  VStack, Button, Icon, Text, Flex,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader,
  DrawerOverlay, DrawerContent, DrawerCloseButton
} from '@chakra-ui/react';
import {
  FaHouse, FaTrophy, FaChartBar, FaDownload, FaBell, FaDice, FaMoon,
  FaPersonDigging, FaFileLines, FaCircleQuestion, FaBookOpen,
  FaRightFromBracket, FaPrint
} from 'react-icons/fa6';
import { SiPix } from 'react-icons/si';
import { MdGavel } from 'react-icons/md';

const IconResultados = (props) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3.548,20.922h16.9a.5.5,0,0,0,0-1H3.548a.5.5,0,0,0,0,1Z" />
    <path d="M9,18.919H6.565a2.5,2.5,0,0,1-2.5-2.5V5.578a2.5,2.5,0,0,1,2.5-2.5H9a2.5,2.5,0,0,1,2.5,2.5V16.419A2.5,2.5,0,0,1,9,18.919ZM6.565,4.078a1.5,1.5,0,0,0-1.5,1.5V16.419a1.5,1.5,0,0,0,1.5,1.5H9a1.5,1.5,0,0,0,1.5-1.5V5.578A1.5,1.5,0,0,0,9,4.078Z" />
    <path d="M17.437,18.919H15a2.5,2.5,0,0,1-2.5-2.5V10.55A2.5,2.5,0,0,1,15,8.05h2.434a2.5,2.5,0,0,1,2.5,2.5v5.869A2.5,2.5,0,0,1,17.437,18.919ZM15,9.05a1.5,1.5,0,0,0-1.5,1.5v5.869a1.5,1.5,0,0,0,1.5,1.5h2.434a1.5,1.5,0,0,0,1.5-1.5V10.55a1.5,1.5,0,0,0-1.5-1.5Z" />
  </Icon>
);

const IconPremiadas = (props) => (
  <Icon viewBox="2 2 19 24" fill="currentColor" {...props}>
    <path d="M19.435,5.055h-.97c.01-.12.02-.24.02-.36a1.645,1.645,0,0,0-.45-1.18,1.462,1.462,0,0,0-1.05-.45H7.025a1.484,1.484,0,0,0-1.06.45,1.6,1.6,0,0,0-.44,1.18c0,.12.01.24.02.36h-.98a1.5,1.5,0,0,0-1.5,1.5v2a4.5,4.5,0,0,0,4.27,4.49c1.07,2.3,2.53,3.79,4.17,4.04v2.85h-4a.5.5,0,1,0,0,1h9a.5.5,0,0,0,0-1h-4v-2.85c1.64-.25,3.1-1.74,4.17-4.04a4.493,4.493,0,0,0,4.26-4.49v-2A1.5,1.5,0,0,0,19.435,5.055Zm-15.37,3.5v-2a.5.5,0,0,1,.5-.5h1.04a22.9,22.9,0,0,0,1.28,5.93A3.5,3.5,0,0,1,4.065,8.555Zm7.94,7.57c-2.82,0-5.23-5.04-5.48-11.47a.573.573,0,0,1,.16-.44.48.48,0,0,1,.34-.15h9.96a.442.442,0,0,1,.33.15.62.62,0,0,1,.17.44C17.235,11.085,14.825,16.125,12.005,16.125Zm7.93-7.57a3.508,3.508,0,0,1-2.8,3.42,23.353,23.353,0,0,0,1.27-5.92h1.03a.5.5,0,0,1,.5.5Z" />
  </Icon>
);

const IconRelatorios = (props) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.436,20.94H5.562a2.5,2.5,0,0,1-2.5-2.5V5.567a2.5,2.5,0,0,1,2.5-2.5H18.436a2.5,2.5,0,0,1,2.5,2.5V18.44A2.5,2.5,0,0,1,18.436,20.94ZM5.562,4.067a1.5,1.5,0,0,0-1.5,1.5V18.44a1.5,1.5,0,0,0,1.5,1.5H18.436a1.5,1.5,0,0,0,1.5-1.5V5.567a1.5,1.5,0,0,0-1.5-1.5Z" />
    <path d="M6.544,8.287h0a.5.5,0,0,1,0-1H12a.5.5,0,0,1,0,1Z" />
    <path d="M9.271,12.5h0a.5.5,0,0,1,0-1h5.454a.5.5,0,0,1,0,1Z" />
    <path d="M12,16.724h0a.5.5,0,0,1,0-1h5.455a.5.5,0,0,1,0,1Z" />
  </Icon>
);

const MenuItem = ({ icon, text, color = '#1A202C', iconColor, onClick }) => (
  <Flex
    as="button"
    w="100%"
    align="center"
    py="14px"
    px={5}
    gap={4}
    _hover={{ bg: 'rgba(0,0,0,0.03)' }}
    onClick={onClick}
    cursor="pointer"
    transition="background 0.2s"
  >
    <Icon as={icon} boxSize="22px" color={iconColor || color} />
    <Text fontSize="16px" fontWeight="500" color={color}>{text}</Text>
  </Flex>
);

function MenuDrawer({ isOpen, onClose, setIsLoggedIn, setAppView }) {
  const nav = (view) => { setAppView(view); onClose(); };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs" isInline>
      <DrawerOverlay bg="rgba(0, 0, 0, 0.48)" />
      <DrawerContent
        w="100px"
        maxW="21vw"
        h="100%"
        position="absolute"
        left="43vw"
        top="0"
        overflowX="hidden"
        bg="#F4F7F5"
        fontFamily="'BaraoFont', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
      >
        <DrawerHeader
          borderBottomWidth="0px"
          fontSize="19px"
          fontWeight="bold"
          color="#1A202C"
          pb={1}
          pt={4}
          px={5}
        >
          Escolha uma opção
        </DrawerHeader>
        <DrawerCloseButton size="lg" top={3} right={4} />

        <DrawerBody
          p={0}
          overflowY="auto"
          sx={{
            '::-webkit-scrollbar': { width: '4px' },
            '::-webkit-scrollbar-track': { background: 'transparent' },
            '::-webkit-scrollbar-thumb': {
              background: '#363636',
              borderRadius: '999px',
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#777879 transparent',
          }}
        >
          <VStack align="stretch" spacing={0}>
            <MenuItem icon={FaDownload} text="Baixar APP" color="#C9A058" iconColor="#C9A058" />
            <MenuItem icon={FaBell} text="Notificações" color="#E53E3E" iconColor="#E53E3E" />
            <MenuItem icon={FaHouse} text="Início" onClick={() => nav('dashboard')} />
            <MenuItem icon={FaDice} text="Loterias" onClick={() => nav('loterias')} />
            <MenuItem icon={FaMoon} text="Sonhos" onClick={() => nav('sonhos')} />
            <MenuItem icon={IconPremiadas} text="Premiadas" onClick={() => nav('premiadas')} />
            <MenuItem icon={IconResultados} text="Resultados" onClick={() => nav('resultados')} />
            <MenuItem icon={IconRelatorios} text="Relatórios" onClick={() => nav('relatorios')} />
            <MenuItem icon={FaPersonDigging} text="Fazendinha" onClick={() => nav('fazendinha')} />
            <MenuItem icon={SiPix} text="Recarga PIX" color="#00B7B5" iconColor="#00B7B5" onClick={() => nav('recargaPix')} />
            <MenuItem icon={SiPix} text="Solicitar Saque" color="#00B7B5" iconColor="#00B7B5" onClick={() => nav('saque')} />
            <MenuItem icon={MdGavel} text="Dúvidas & Regras" />
            <MenuItem icon={FaBookOpen} text="Como Jogar" />
            <MenuItem icon={FaRightFromBracket} text="Sair" iconColor="#969696" onClick={() => { setIsLoggedIn(); onClose(); }} />
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="0px" justifyContent="center" py={4}>
          <Button
            variant="outline"
            onClick={onClose}
            borderRadius="8px"
            borderColor="#1A202C"
            color="#1A202C"
            fontWeight="normal"
            fontSize="16px"
            w="100%"
            h="44px"
          >
            Fechar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
export default MenuDrawer;
