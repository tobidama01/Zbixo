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
      title: `✅ Depósito de ${formatBRL(pixData.valor)} confirmado!`,
      status: 'success', duration: 4000, position: 'top',
    });
    setPixData(null);
    setValor('');
  };

  return (
    <Box bg="white" w="100%" minH="100vh">
      <AppHeader title="MEGABIXO" saldo={saldo} onBack={onBack} onMenuOpen={onMenuOpen} />

      <Box p={4}>
        <Text fontWeight="bold" fontSize="lg" mb={1}>Recarga PIX</Text>
        <Text color="gray.500" fontSize="sm" mb={5}>
          Informe o valor que deseja creditar no seu saldo para jogar.
        </Text>

        {!pixData ? (
          <>
            {/* Campo de valor */}
            <Box bg="gray.50" borderRadius="lg" mb={5}>
              <Flex align="center" px={4} py={4} borderBottom="1px solid" borderColor="gray.200">
                <Text fontSize="md" color="gray.500" mr={2}>R$</Text>
                <Input
                  variant="unstyled"
                  value={valor}
                  type="number"
                  placeholder="0,00"
                  fontSize="xl"
                  fontWeight="bold"
                  onChange={e => setValor(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  color="gray.400"
                  fontWeight="normal"
                  onClick={() => setValor('')}
                >
                  Limpar
                </Button>
              </Flex>

              <Box px={4} py={3}>
                <Text fontSize="sm" fontWeight="bold" mb={2}>Valores rápidos:</Text>
                <HStack spacing={2}>
                  {quickValues.map(v => (
                    <Button
                      key={v}
                      size="sm"
                      variant={valorNum === v ? 'solid' : 'outline'}
                      bg={valorNum === v ? 'white' : 'transparent'}
                      border="1px solid"
                      borderColor="gray.300"
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
              bg="black"
              color="white"
              h="52px"
              borderRadius="lg"
              fontSize="md"
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
              <Text fontSize="sm">
                Pague o PIX abaixo para creditar <strong>{formatBRL(pixData.valor)}</strong> na sua conta.
              </Text>
            </Alert>

            {/* QR Code simulado */}
            <Box border="2px solid black" borderRadius="md" p={6} mb={4} textAlign="center">
              <Box
                w="160px" h="160px" mx="auto"
                bg="white"
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                color="gray.400"
              >
                QR CODE PIX
              </Box>
              <Badge colorScheme="green" mt={3}>TXID: {pixData.txid}</Badge>
            </Box>

            {/* Copia e cola */}
            <Box bg="gray.50" p={3} borderRadius="md" mb={4}>
              <Text fontSize="xs" color="gray.500" mb={1}>PIX Copia e Cola:</Text>
              <Text fontSize="xs" fontFamily="mono" wordBreak="break-all">{pixData.copiaCola}</Text>
            </Box>

            <Button
              w="full" mb={2} h="50px" borderRadius="lg"
              bg={copiado ? 'green.500' : 'black'} color="white"
              leftIcon={<Icon as={copiado ? FaCheck : FaCopy} />}
              onClick={copiar}
            >
              {copiado ? 'Copiado!' : 'Copiar Código PIX'}
            </Button>

            <Divider my={3} />

            <Text fontSize="sm" color="gray.400" textAlign="center" mb={3}>
              Após pagar, clique em confirmar:
            </Text>

            <Button w="full" h="50px" borderRadius="lg" bg="green.500" color="white"
              leftIcon={<Icon as={FaCheck} />} onClick={confirmarPagamento}>
              Confirmar Pagamento
            </Button>

            <Button w="full" mt={2} variant="ghost" color="gray.500"
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