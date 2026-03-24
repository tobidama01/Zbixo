// src/components/financeiro/RecargaPix.jsx
import React, { useState } from 'react';
import {
  Box, VStack, HStack, Text, Button, Input,
  useToast, Icon, Alert, AlertIcon, Badge, Flex, Divider
} from '@chakra-ui/react';
import { FaCopy, FaCheck } from 'react-icons/fa6';
import AppHeader from '../AppHeader';
import { formatBRL, gerarPixPayload } from '../../utils/helpers';

function RecargaPix({ onBack, onMenuOpen, currentUser, registrarDeposito }) {
  const [valor, setValor] = useState('');
  const [pixData, setPixData] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const toast = useToast();
  const saldo = currentUser?.saldo || 0;
  const quickValues = [5, 10, 20, 50];

  const valorNum = parseFloat(valor) || 0;

  const gerarPagamento = () => {
    if (valorNum < 5) {
      toast({ title: 'Valor mínimo é R$ 5,00', status: 'warning', duration: 2000, position: 'top' });
      return;
    }
    const pix = gerarPixPayload(valorNum, 'Recarga ZBIXO');
    setPixData(pix);
  };

  const copiar = () => {
    navigator.clipboard?.writeText(pixData.copiaCola).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    toast({ title: 'Código PIX copiado!', status: 'success', duration: 2000, position: 'top' });
  };

  const confirmarPagamento = () => {
    registrarDeposito(pixData.valor, pixData.txid);
    toast({
      title: `Depósito de ${formatBRL(pixData.valor)} confirmado!`,
      status: 'success', duration: 4000, position: 'top',
    });
    setPixData(null);
    setValor('');
  };

  return (
    <Box bg="white" w="100%" minH="100vh">
      <AppHeader title="MEGABIXO" saldo={saldo} onBack={onBack} onMenuOpen={onMenuOpen} />

      <Box p={4}>
        <Text fontWeight="bold" fontSize="18px" mb={1}>Recarga PIX</Text>
        <Text color="#A0AEC0" fontSize="13px" mb={5}>
          Informe o valor que deseja creditar no seu saldo para jogar.
        </Text>

        {!pixData ? (
          <>
            <Box bg="#F7FAFC" borderRadius="lg" mb={5}>
              <Flex align="center" px={4} py={4} borderBottom="1px solid" borderColor="#EDF2F7">
                <Text fontSize="14px" color="#A0AEC0" mr={2}>R$</Text>
                <Input
                  variant="unstyled"
                  value={valor}
                  type="number"
                  placeholder="0,00"
                  fontSize="20px"
                  fontWeight="bold"
                  onChange={e => setValor(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  color="#A0AEC0"
                  fontWeight="normal"
                  onClick={() => setValor('')}
                >
                  Limpar
                </Button>
              </Flex>

              <Box px={4} py={3}>
                <Text fontSize="13px" fontWeight="bold" mb={2}>Valores rápidos:</Text>
                <HStack spacing={2}>
                  {quickValues.map(v => (
                    <Button
                      key={v}
                      size="sm"
                      variant={valorNum === v ? 'solid' : 'outline'}
                      bg={valorNum === v ? 'white' : 'transparent'}
                      border="1px solid"
                      borderColor="#EDF2F7"
                      borderRadius="md"
                      fontWeight="normal"
                      px={4}
                      onClick={() => setValor(v.toFixed(2))}
                    >
                      +{v}
                    </Button>
                  ))}
                </HStack>
              </Box>
            </Box>

            <Button
              w="full"
              bg="#1A202C"
              color="white"
              h="52px"
              borderRadius="lg"
              fontSize="14px"
              isDisabled={valorNum < 5}
              onClick={gerarPagamento}
            >
              Gerar Pagamento
            </Button>
          </>
        ) : (
          <Box>
            <Alert status="info" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text fontSize="13px">
                Pague o PIX abaixo para creditar <strong>{formatBRL(pixData.valor)}</strong> na sua conta.
              </Text>
            </Alert>

            <Box border="2px solid #1A202C" borderRadius="md" p={6} mb={4} textAlign="center">
              <Box
                w="160px" h="160px" mx="auto"
                bg="white"
                border="1px solid #1A202C"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="12px"
                color="#A0AEC0"
              >
                QR CODE PIX
              </Box>
              <Badge colorScheme="green" mt={3}>TXID: {pixData.txid}</Badge>
            </Box>

            <Box bg="#F7FAFC" p={3} borderRadius="md" mb={4}>
              <Text fontSize="12px" color="#A0AEC0" mb={1}>PIX Copia e Cola:</Text>
              <Text fontSize="12px" fontFamily="mono" wordBreak="break-all">{pixData.copiaCola}</Text>
            </Box>

            <Button
              w="full" mb={2} h="50px" borderRadius="lg"
              bg={copiado ? '#38A169' : '#1A202C'} color="white"
              leftIcon={<Icon as={copiado ? FaCheck : FaCopy} />}
              onClick={copiar}
            >
              {copiado ? 'Copiado!' : 'Copiar Código PIX'}
            </Button>

            <Divider my={3} />

            <Text fontSize="13px" color="#A0AEC0" textAlign="center" mb={3}>
              Após pagar, clique em confirmar:
            </Text>

            <Button w="full" h="50px" borderRadius="lg" bg="#38A169" color="white"
              leftIcon={<Icon as={FaCheck} />} onClick={confirmarPagamento}>
              Confirmar Pagamento
            </Button>

            <Button w="full" mt={2} variant="ghost" color="#A0AEC0"
              onClick={() => setPixData(null)}>
              Cancelar
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default RecargaPix;
