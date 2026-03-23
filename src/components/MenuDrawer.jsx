// src/components/MenuDrawer.jsx
import React from 'react';
import {
  VStack, Button, Icon, Text,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader,
  DrawerOverlay, DrawerContent, DrawerCloseButton
} from '@chakra-ui/react';
import {
  FaHouse, FaTrophy, FaChartBar, FaDownload, FaBell, FaDice, FaMoon,
  FaPersonDigging, FaFileLines, FaRightFromBracket, FaCalculator,
  FaClockRotateLeft
} from 'react-icons/fa6';
import { LuArrowDownUp } from 'react-icons/lu';
import { RiPixelfedFill } from 'react-icons/ri';

const MenuItem = ({ icon, text, color = 'gray.700', onClick }) => (
  <Button variant="ghost" justifyContent="flex-start" w="100%" fontSize="md"
    color={color} leftIcon={<Icon as={icon} boxSize={5} />} onClick={onClick}>
    {text}
  </Button>
);

function MenuDrawer({ isOpen, onClose, setIsLoggedIn, setAppView }) {
  const nav = (view) => { setAppView(view); onClose(); };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxW="300px">
        <DrawerHeader borderBottomWidth="1px">Escolha uma opção</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody p={2}>
          <VStack align="stretch" spacing={1}>
            <MenuItem icon={FaDownload}        text="Baixar APP"        color="goldenrod" />
            <MenuItem icon={FaBell}            text="Notificações"      color="red.500" />
            <MenuItem icon={FaHouse}           text="Início"            onClick={() => nav('dashboard')} />
            <MenuItem icon={FaDice}            text="Loterias"          onClick={() => nav('loterias')} />
            <MenuItem icon={FaMoon}            text="Sonhos"            onClick={() => nav('sonhos')} />
            <MenuItem icon={FaTrophy}          text="Premiadas"         onClick={() => nav('premiadas')} />
            <MenuItem icon={FaChartBar}        text="Resultados"        onClick={() => nav('resultados')} />
            <MenuItem icon={FaFileLines}       text="Relatórios"        onClick={() => nav('relatorios')} />
            <MenuItem icon={FaPersonDigging}   text="Fazendinha"        onClick={() => nav('fazendinha')} />
            <MenuItem icon={FaCalculator}      text="Calculadora"       onClick={() => nav('calculadora')} />
            <MenuItem icon={FaClockRotateLeft} text="Atrasados"         onClick={() => nav('atrasados')} />
            <MenuItem icon={RiPixelfedFill}    text="Recarga PIX"       color="teal.500" onClick={() => nav('recargaPix')} />
            <MenuItem icon={LuArrowDownUp}     text="Solicitar Saque"   color="teal.500" onClick={() => nav('saque')} />
            <MenuItem icon={FaRightFromBracket} text="Sair"             color="red.500" onClick={() => { setIsLoggedIn(); onClose(); }} />
          </VStack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
export default MenuDrawer;
