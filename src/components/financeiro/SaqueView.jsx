// src/components/financeiro/SaqueView.jsx
import React, { useState } from 'react';
import {
  Box, VStack, HStack, Text, Button, Input, Select,
  useToast, Alert, AlertIcon, Divider, Icon, Badge, Flex, Spacer,
  FormControl, FormErrorMessage
} from '@chakra-ui/react';
import AppHeader from '../AppHeader';
import { formatBRL } from '../../utils/helpers';
import { FaMoneyBill } from 'react-icons/fa6';

const TIPOS_CHAVE = ['Celular', 'CPF', 'E-mail', 'CNPJ', 'Chave aleatória'];

// ── Validadores por tipo de chave ─────────────────────────────────────────────
function validarChave(tipo, valor) {
  const v = valor.trim();

  if (tipo === 'Celular') {
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11)
      return 'Celular inválido. Use DDD + número (ex: 11999999999)';
    return null;
  }

  if (tipo === 'CPF') {
    const digits = v.replace(/\D/g, '');
    if (digits.length !== 11)
      return 'CPF deve ter 11 dígitos';
    // Validação módulo 11
    if (/^(\d)\1+$/.test(digits)) return 'CPF inválido';
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let r = (sum * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(digits[9])) return 'CPF inválido';
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    r = (sum * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(digits[10])) return 'CPF inválido';
    return null;
  }

  if (tipo === 'E-mail') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v))
      return 'E-mail inválido. Ex: nome@email.com';
    if (v.length > 100)
      return 'E-mail muito longo';
    return null;
  }

  if (tipo === 'CNPJ') {
    const digits = v.replace(/\D/g, '');
    if (digits.length !== 14)
      return 'CNPJ deve ter 14 dígitos';
    if (/^(\d)\1+$/.test(digits)) return 'CNPJ inválido';
    // Validação dígitos verificadores
    const calc = (d, n) => {
      let sum = 0, pos = n - 7;
      for (let i = n; i >= 1; i--) {
        sum += parseInt(d[n - i]) * pos--;
        if (pos < 2) pos = 9;
      }
      return sum % 11 < 2 ? 0 : 11 - (sum % 11);
    };
    if (calc(digits, 12) !== parseInt(digits[12])) return 'CNPJ inválido';
    if (calc(digits, 13) !== parseInt(digits[13])) return 'CNPJ inválido';
    return null;
  }

  if (tipo === 'Chave aleatória') {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(v))
      return 'Chave aleatória inválida. Ex: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    return null;
  }

  return null;
}

// ── Máscara por tipo ──────────────────────────────────────────────────────────
function aplicarMascara(tipo, valor) {
  const digits = valor.replace(/\D/g, '');

  if (tipo === 'Celular') {
    if (digits.length <= 10)
      return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  }

  if (tipo === 'CPF')
    return digits.slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  if (tipo === 'CNPJ')
    return digits.slice(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

  return valor;
}

// ── Limite de caracteres por tipo ─────────────────────────────────────────────
function maxLength(tipo) {
  if (tipo === 'Celular')        return 15;
  if (tipo === 'CPF')            return 14;
  if (tipo === 'E-mail')         return 100;
  if (tipo === 'CNPJ')           return 18;
  if (tipo === 'Chave aleatória')return 36;
  return 100;
}

// ── Placeholder por tipo ──────────────────────────────────────────────────────
function placeholder(tipo) {
  if (tipo === 'Celular')        return '(11) 99999-9999';
  if (tipo === 'CPF')            return '000.000.000-00';
  if (tipo === 'E-mail')         return 'nome@email.com';
  if (tipo === 'CNPJ')           return '00.000.000/0001-00';
  if (tipo === 'Chave aleatória')return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
  return '';
}

function SaqueView({ onBack, onMenuOpen, currentUser, registrarSaque, transacoes }) {
  const [tipoChave, setTipoChave] = useState('');
  const [chave, setChave] = useState('');
  const [chaveErro, setChaveErro] = useState('');
  const [valor, setValor] = useState('');
  const [valorErro, setValorErro] = useState('');
  const [passo, setPasso] = useState('form');
  const toast = useToast();
  const saldo = currentUser?.saldo || 0;

  const saques = transacoes.filter(t => t.tipo === 'saque');

  const handleChaveChange = (e) => {
    const tipo = tipoChave;
    let v = e.target.value;

    // Aplica máscara para tipos com dígitos
    if (['Celular', 'CPF', 'CNPJ'].includes(tipo)) {
      v = aplicarMascara(tipo, v);
    }

    setChave(v);
    // Limpa erro ao digitar
    if (chaveErro) setChaveErro('');
  };

  const avancar = () => {
    if (!tipoChave) {
      toast({ title: 'Selecione o tipo de chave PIX', status: 'error', duration: 2000, position: 'top' });
      return;
    }
    if (!chave.trim()) {
      setChaveErro('Informe a chave PIX');
      return;
    }
    const erro = validarChave(tipoChave, chave);
    if (erro) {
      setChaveErro(erro);
      return;
    }
    setChaveErro('');
    setPasso('valor');
  };

  const handleValorChange = (e) => {
    const v = e.target.value;
    // Só aceita números e ponto/vírgula
    if (!/^\d*[.,]?\d{0,2}$/.test(v)) return;
    setValor(v);
    if (valorErro) setValorErro('');
  };

  const confirmarSaque = () => {
    const v = parseFloat(valor.replace(',', '.'));

    if (isNaN(v) || v <= 0) {
      setValorErro('Informe um valor válido');
      return;
    }
    if (v < 20) {
      setValorErro('Valor mínimo de saque é R$ 20,00');
      return;
    }
    if (v > 2500) {
      setValorErro('Valor máximo de saque é R$ 2.500,00');
      return;
    }
    if (v > saldo) {
      setValorErro('Saldo insuficiente');
      return;
    }

    const result = registrarSaque(v, chave, tipoChave);
    if (result.ok) {
      toast({ title: result.msg, status: 'success', duration: 4000, position: 'top' });
      setTipoChave(''); setChave(''); setValor('');
      setChaveErro(''); setValorErro('');
      setPasso('form');
    } else {
      toast({ title: result.msg, status: 'error', duration: 3000, position: 'top' });
    }
  };

  return (
    <Box bg="white" w="100%" minH="100vh">
      <AppHeader title="SAQUES" saldo={saldo} onBack={onBack} onMenuOpen={onMenuOpen} />

      <Box p={4}>
        {passo === 'form' && (
          <>
            <Button w="full" bg="black" color="white" h="50px" mb={4}
              leftIcon={<Icon as={FaMoneyBill} />}
              onClick={() => setPasso('pix')}>
              Sacar
            </Button>

            {saques.length > 0 && (
              <>
                <Text fontWeight="bold" mb={2}>Histórico de saques:</Text>
                <VStack spacing={2} align="stretch">
                  {saques.slice(0, 10).map(s => (
                    <Flex key={s.id} p={3} bg="gray.50" borderRadius="md" align="center">
                      <Box>
                        <Text fontSize="sm" fontWeight="bold">{formatBRL(s.valor)}</Text>
                        <Text fontSize="xs" color="gray.500">{s.chavePix} ({s.tipoChave})</Text>
                        <Text fontSize="xs" color="gray.400">
                          {new Date(s.data).toLocaleDateString('pt-BR')}
                        </Text>
                      </Box>
                      <Spacer />
                      <Badge colorScheme={s.status === 'pendente' ? 'yellow' : 'green'}>
                        {s.status === 'pendente' ? 'Pendente' : 'Pago'}
                      </Badge>
                    </Flex>
                  ))}
                </VStack>
              </>
            )}
          </>
        )}

        {passo === 'pix' && (
          <>
            <Box bg="orange.50" border="1px solid" borderColor="orange.200"
              borderRadius="md" p={4} mb={4}>
              <Text fontWeight="bold" mb={2}>Regras de saque</Text>
              <Text fontSize="sm">Os saques podem ser feitos para qualquer chave pix, desde que sejam feitos para sua{' '}
                <Text as="span" color="red.500" fontWeight="bold">titularidade.</Text>
              </Text>
              <Text fontSize="sm" mt={2}><strong>Horários de pagamento:</strong> 24 horas.</Text>
              <Text fontSize="sm"><strong>Tempo para valor em conta:</strong> 2-5 dias.</Text>
              <Text fontSize="sm"><strong>Saque mínimo:</strong> R$ 20,00</Text>
              <Text fontSize="sm"><strong>Saque máximo:</strong> R$ 2.500,00</Text>
              <Text fontSize="sm"><strong>Limite diário:</strong> R$ 15.000,00</Text>
              <Text fontSize="sm"><strong>Taxa de saque:</strong> 0%</Text>
              <Text color="red.500" fontSize="sm" fontWeight="bold" mt={2}>
                Saques que não atenderem as regras acima serão recusados.
              </Text>
            </Box>

            <Box bg="white" border="1px solid" borderColor="gray.200"
              borderRadius="md" p={4} mb={4}>
              <Text fontWeight="bold" mb={3}>Dados do PIX</Text>

              <Select placeholder="Selecione a chave PIX" value={tipoChave}
                onChange={e => { setTipoChave(e.target.value); setChave(''); setChaveErro(''); }}
                mb={3} borderColor="blue.400" borderWidth="2px">
                {TIPOS_CHAVE.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>

              {tipoChave && (
                <FormControl isInvalid={!!chaveErro}>
                  <Input
                    placeholder={placeholder(tipoChave)}
                    value={chave}
                    onChange={handleChaveChange}
                    maxLength={maxLength(tipoChave)}
                    borderColor={chaveErro ? 'red.400' : 'blue.400'}
                    borderWidth="2px"
                    inputMode={['Celular','CPF','CNPJ'].includes(tipoChave) ? 'numeric' : 'text'}
                  />
                  <FormErrorMessage>{chaveErro}</FormErrorMessage>
                  <Text fontSize="xs" color="gray.400" mt={1} textAlign="right">
                    {chave.length}/{maxLength(tipoChave)}
                  </Text>
                </FormControl>
              )}
            </Box>

            <Button w="full" bg="black" color="white" h="50px" onClick={avancar}>
              Avançar
            </Button>
            <Button w="full" mt={2} variant="ghost" onClick={() => setPasso('form')}>
              Cancelar
            </Button>
          </>
        )}

        {passo === 'valor' && (
          <>
            <Box bg="white" border="1px solid" borderColor="gray.200"
              borderRadius="md" p={4} mb={4}>
              <Text fontWeight="bold">Chave PIX</Text>
              <Text fontSize="sm" color="gray.600">{tipoChave}: {chave}</Text>
            </Box>

            <Alert status="info" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text fontSize="sm">Saldo disponível: <strong>{formatBRL(saldo)}</strong></Text>
            </Alert>

            <FormControl isInvalid={!!valorErro} mb={4}>
              <Text fontWeight="bold" mb={2}>Valor do saque:</Text>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="Ex: 100,00"
                value={valor}
                onChange={handleValorChange}
                borderColor={valorErro ? 'red.400' : 'blue.400'}
                borderWidth="2px"
                maxLength={8}
              />
              <FormErrorMessage>{valorErro}</FormErrorMessage>
            </FormControl>

            {valor && !isNaN(parseFloat(valor.replace(',', '.'))) && (
              <Text fontSize="sm" color="gray.600" mb={4}>
                Taxa: R$ 0,00 | Você receberá: <strong>{formatBRL(parseFloat(valor.replace(',', '.')))}</strong>
              </Text>
            )}

            <Button w="full" bg="black" color="white" h="50px" onClick={confirmarSaque}>
              Confirmar Saque
            </Button>
            <Button w="full" mt={2} variant="ghost" onClick={() => setPasso('pix')}>
              Voltar
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}

export default SaqueView;