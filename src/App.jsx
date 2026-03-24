// src/App.jsx
import { useState } from 'react';
import { Box, Image, Button, Icon, Flex, useDisclosure } from '@chakra-ui/react';
import { FaWhatsapp } from 'react-icons/fa6';

import TelaLogin from './components/TelaLogin';
import RegisterView from './components/RegisterView';
import RecoveryView from './components/RecoveryView';
import ForceResetView from './components/ForceResetView';
import DashboardView from './components/DashboardView';
import MenuDrawer from './components/MenuDrawer';
import TipoDeJogoView from './components/TipoDeJogoView';
import TabelaBichosView from './components/TabelaBichosView';
import RelatoriosView from './components/RelatoriosView';
import CotacoesView from './components/CotacoesView';
import LoteriasCotacaoView from './components/LoteriasCotacaoView';

import LoteriasFlow from './components/jogos/LoteriasFlow';
import QuininhaFlow from './components/jogos/QuininhaFlow';
import FazendinhaFlow from './components/jogos/FazendinhaFlow';
import RecargaPix from './components/financeiro/RecargaPix';
import SaqueView from './components/financeiro/SaqueView';
import CalculadoraView from './components/CalculadoraView';
import SonhosView from './components/SonhosView';
import HoroscopoView from './components/HoroscopoView';

import { useAppState } from './hooks/useAppState';

function App() {
  const {
    users, setUsers, currentUser, setCurrentUser,
    apostas, transacoes, registrarDeposito, registrarSaque, registrarAposta
  } = useAppState();

  const [authView, setAuthView] = useState('login');
  const [appView, setAppView] = useState('dashboard');
  const [userToReset, setUserToReset] = useState(null);
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();

  const handleLoginSuccess = (user) => {
    if (user.mustResetPassword) {
      setUserToReset(user.cpf);
      setAuthView('forceReset');
    } else {
      setCurrentUser(user);
      setAppView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('login');
    onMenuClose();
  };

  const cp = { currentUser, onMenuOpen, onBack: () => setAppView('dashboard'), setAppView };

  const renderAuth = () => {
    switch (authView) {
      case 'register':   return <RegisterView setView={setAuthView} setUsers={setUsers} users={users} />;
      case 'recovery':   return <RecoveryView setView={setAuthView} setUsers={setUsers} users={users} />;
      case 'forceReset': return <ForceResetView setView={setAuthView} setUsers={setUsers} users={users} cpfToReset={userToReset} />;
      default:           return <TelaLogin setView={setAuthView} users={users} onLoginSuccess={handleLoginSuccess} />;
    }
  };

  const Placeholder = ({ title }) => (
    <Box bg="white" w="100%" minH="100vh" p={8} textAlign="center">
      <Button mb={4} onClick={() => setAppView('dashboard')}>← Voltar</Button>
      <Box mt={8} color="#A0AEC0" fontSize="16px">{title} — Em breve</Box>
    </Box>
  );

  const renderApp = () => {
    switch (appView) {
      case 'dashboard':      return <DashboardView {...cp} />;
      case 'tipoDeJogo':     return <TipoDeJogoView {...cp} />;
      case 'loterias':       return <LoteriasFlow {...cp} registrarAposta={registrarAposta} />;
      case 'quininha':       return <QuininhaFlow {...cp} registrarAposta={registrarAposta} />;
      case 'fazendinha':     return <FazendinhaFlow {...cp} registrarAposta={registrarAposta} />;
      case 'recargaPix':     return <RecargaPix {...cp} registrarDeposito={registrarDeposito} />;
      case 'saque':          return <SaqueView {...cp} registrarSaque={registrarSaque} transacoes={transacoes} />;
      case 'calculadora':    return <CalculadoraView {...cp} />;
      case 'sonhos':         return <SonhosView {...cp} />;
      case 'horoscopo':      return <HoroscopoView {...cp} />;
      case 'tabelaBichos':   return <TabelaBichosView {...cp} />;
      case 'relatorios':     return <RelatoriosView {...cp} apostas={apostas} transacoes={transacoes} />;
      case 'cotacoes':       return <CotacoesView {...cp} />;
      case 'loteriasCotacao':return <LoteriasCotacaoView {...cp} />;
      case 'premiadas':      return <Placeholder title="Premiadas" />;
      case 'resultados':     return <Placeholder title="Resultados" />;
      case 'atrasados':      return <Placeholder title="Atrasados" />;
      default:               return <DashboardView {...cp} />;
    }
  };

  return (
    <Box bg={currentUser ? '#F7FAFC' : 'containerBg'}
      w="100%" maxW="420px" minH="100vh"
      boxShadow="0 0 20px rgba(0,0,0,0.06)" position="relative">
      {currentUser ? renderApp() : (
        <Flex direction="column" align="center" justify="center" py="30px" px="25px" minH="100vh">
          <Image src="https://i.imgur.com/65xP0q1.png" alt="Logo"
            w="140px" h="140px" borderRadius="full" mb="30px" mt="20px" />
          <Button variant="outline" color="white" borderColor="white" borderRadius="20px"
            fontSize="14px" w="100%" mb="25px" _hover={{ bg: 'rgba(255,255,255,0.1)' }}
            rightIcon={<Icon as={FaWhatsapp} fontSize="1.2em" />}>
            CHAMAR PROMOTOR AGORA
          </Button>
          {renderAuth()}
        </Flex>
      )}
      <MenuDrawer isOpen={isMenuOpen} onClose={onMenuClose}
        setIsLoggedIn={handleLogout} setAppView={setAppView} />
    </Box>
  );
}
export default App;
