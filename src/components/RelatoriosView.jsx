import React, { useState } from 'react';
import {
  Box, Flex, VStack, Text, Icon, Spacer,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Badge, Button, Divider, Heading
} from '@chakra-ui/react';
import {
  FaDollarSign, FaFileInvoice, FaPersonDigging, FaDice, FaTags,
  FaChevronRight, FaArrowLeft, FaRotateRight, FaEye, FaEyeSlash,
} from 'react-icons/fa6';
import { formatBRL, agruparPorData, ultimos7Dias } from '../utils/helpers';

// ── Header padrão interno (azul) ──────────────────────────────────────────────
function InnerHeader({ title, saldo, onBack }) {
  const [vis, setVis] = useState(false);
  return (
    <>
      <Flex as="header" align="center" p={4} bg="black" color="white">
        <Icon as={FaArrowLeft} boxSize={5} cursor="pointer" onClick={onBack} />
        <Spacer />
        <Text fontWeight="bold" fontSize="13px" letterSpacing="1px">{title}</Text>
        <Spacer />
        <Text fontSize="13px">☰</Text>
      </Flex>
      <Flex align="center" px={4} py={3} bg="#000080" color="white">
        <Icon as={FaRotateRight} boxSize={4} cursor="pointer" />
        <Spacer />
        <Text fontWeight="bold" fontSize="16px">
          {vis ? formatBRL(saldo) : 'R$ *****,**'}
        </Text>
        <Icon as={vis ? FaEyeSlash : FaEye} boxSize={4} ml={2} cursor="pointer"
          onClick={() => setVis(v => !v)} />
      </Flex>
    </>
  );
}

// ── Item de lista genérico ─────────────────────────────────────────────────────
const ReportItem = ({ icon, text, onClick }) => (
  <Flex as="button" w="100%" px={4} py={4} align="center"
    borderBottom="1px solid" borderColor="gray.100" _hover={{ bg: 'gray.50' }}
    onClick={onClick}>
    <Icon as={icon} boxSize={5} color="#000080" />
    <Text fontWeight="bold" ml={4} fontSize="sm" color="#000080">{text}</Text>
    <Spacer />
    <Icon as={FaChevronRight} color="gray.400" boxSize={4} />
  </Flex>
);

// ── Sub-tela: lista de datas genérica ─────────────────────────────────────────
function ListaDatas({ titulo, onBack, saldo }) {
  const dias = ultimos7Dias();
  return (
    <Box bg="white" w="100%" minH="100vh">
      <InnerHeader title={titulo} saldo={saldo} onBack={onBack} />
      <VStack spacing={0} align="stretch">
        {dias.map(dia => (
          <Flex key={dia} px={4} py={4} align="center"
            borderBottom="1px solid" borderColor="gray.100"
            cursor="pointer" _hover={{ bg: 'gray.50' }}>
            <Text fontSize="sm">{dia}</Text>
            <Spacer />
            <Icon as={FaChevronRight} color="gray.400" boxSize={4} />
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

// ── Sub-tela: SALDO ────────────────────────────────────────────────────────────
function SaldoView({ onBack, saldo, transacoes }) {
  const dias = ultimos7Dias();
  return (
    <Box bg="white" w="100%" minH="100vh">
      <InnerHeader title="CONSULTAR SALDO" saldo={saldo} onBack={onBack} />
      <VStack spacing={0} align="stretch">
        {dias.map(dia => {
          const txDia = transacoes.filter(t => {
            const d = new Date(t.data).toLocaleDateString('pt-BR');
            return d === dia;
          });
          const total = txDia.reduce((s, t) =>
            t.tipo === 'deposito' ? s + t.valor : s - t.valor, 0);
          return (
            <Flex key={dia} px={4} py={4} align="center"
              borderBottom="1px solid" borderColor="gray.100"
              cursor="pointer" _hover={{ bg: 'gray.50' }}>
              <Text fontSize="sm">{dia}</Text>
              <Spacer />
              {txDia.length > 0 && (
                <Text fontSize="xs" color={total >= 0 ? 'green.500' : 'red.500'} mr={2}>
                  {total >= 0 ? '+' : ''}{formatBRL(total)}
                </Text>
              )}
              <Icon as={FaChevronRight} color="gray.400" boxSize={4} />
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
}

// ── Sub-tela: PULES ────────────────────────────────────────────────────────────
function PulesView({ onBack, saldo, apostas }) {
  const agrupadas = agruparPorData(apostas.filter(a => a.tipo === 'loterias' || a.tipo === 'quininha' || a.tipo === 'lotinha'));
  const dias = Object.keys(agrupadas).sort((a, b) => {
    const parse = d => { const [dd,mm,yy] = d.split('/'); return new Date(`${yy}-${mm}-${dd}`); };
    return parse(b) - parse(a);
  });
  return (
    <Box bg="white" w="100%" minH="100vh">
      <InnerHeader title="PULES" saldo={saldo} onBack={onBack} />
      {dias.length === 0
        ? <Text p={8} textAlign="center" color="gray.400">Nenhuma aposta encontrada</Text>
        : (
          <Accordion allowToggle>
            {dias.map(dia => (
              <AccordionItem key={dia}>
                <AccordionButton px={4} py={4}>
                  <Text flex={1} textAlign="left" fontSize="sm">{dia}</Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={3} px={3}>
                  <VStack spacing={2} align="stretch">
                    {agrupadas[dia].map(a => (
                      <Box key={a.id} p={3} bg="gray.50" borderRadius="md">
                        <Flex justify="space-between">
                          <Text fontWeight="bold" fontSize="sm">{a.descricao}</Text>
                          <Badge colorScheme={a.status === 'ativa' ? 'green' : 'gray'}>{a.status}</Badge>
                        </Flex>
                        <Text fontSize="xs" color="gray.500">
                          Palpites: {Array.isArray(a.palpites) ? a.palpites.join(', ') : a.palpites}
                        </Text>
                        <Flex justify="space-between" mt={1}>
                          <Text fontSize="sm" fontWeight="bold">{formatBRL(a.valor)}</Text>
                          <Text fontSize="xs" color="gray.400">Cód: {a.codigo}</Text>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )
      }
    </Box>
  );
}

// ── Sub-tela: FAZENDINHA ───────────────────────────────────────────────────────
function FazendinhaRelView({ onBack, saldo, apostas }) {
  const fazApostas = apostas.filter(a => a.tipo === 'fazendinha');
  const agrupadas = agruparPorData(fazApostas);
  const dias = Object.keys(agrupadas).sort((a, b) => {
    const parse = d => { const [dd,mm,yy] = d.split('/'); return new Date(`${yy}-${mm}-${dd}`); };
    return parse(b) - parse(a);
  });
  const totalGasto = fazApostas.reduce((s, a) => s + a.valor, 0);

  return (
    <Box bg="white" w="100%" minH="100vh">
      <InnerHeader title="FAZENDINHA" saldo={saldo} onBack={onBack} />

      {/* Resumo */}
      <Box px={4} py={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
        <Flex justify="space-between">
          <Text fontSize="sm" color="gray.600">Total apostado:</Text>
          <Text fontSize="sm" fontWeight="bold" color="red.500">- {formatBRL(totalGasto)}</Text>
        </Flex>
        <Flex justify="space-between" mt={1}>
          <Text fontSize="sm" color="gray.600">Total ganho:</Text>
          <Text fontSize="sm" fontWeight="bold" color="green.500">R$ 0,00</Text>
        </Flex>
      </Box>

      {dias.length === 0
        ? <Text p={8} textAlign="center" color="gray.400">Nenhuma aposta de Fazendinha encontrada</Text>
        : (
          <Accordion allowToggle>
            {dias.map(dia => (
              <AccordionItem key={dia}>
                <AccordionButton px={4} py={4}>
                  <Text flex={1} textAlign="left" fontSize="sm">{dia}</Text>
                  <Text fontSize="xs" color="gray.500" mr={2}>
                    {agrupadas[dia].length} aposta(s)
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={3} px={3}>
                  <VStack spacing={2} align="stretch">
                    {agrupadas[dia].map(a => (
                      <Box key={a.id} p={3} bg="gray.50" borderRadius="md">
                        <Flex justify="space-between">
                          <Text fontWeight="bold" fontSize="sm">{a.modalidadeNome}</Text>
                          <Badge colorScheme={a.status === 'ativa' ? 'green' : 'gray'}>{a.status}</Badge>
                        </Flex>
                        <Text fontSize="xs" color="gray.500">
                          Palpites: {Array.isArray(a.palpites) ? a.palpites.join(', ') : a.palpites}
                        </Text>
                        <Flex justify="space-between" mt={1}>
                          <Text fontSize="sm" fontWeight="bold" color="red.500">- {formatBRL(a.valor)}</Text>
                          <Text fontSize="xs" color="gray.400">Cód: {a.codigo}</Text>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )
      }
    </Box>
  );
}

// ── Sub-tela: ROLETINHA ────────────────────────────────────────────────────────
function RoletinhaRelView({ onBack, saldo, apostas }) {
  const dados = apostas.filter(a => a.tipo === 'roletinha');
  const totalApostado = dados.reduce((s, a) => s + a.valor, 0);
  const totalGanho = dados.filter(a => a.status === 'ganhou').reduce((s, a) => s + (a.premio || 0), 0);

  return (
    <Box bg="white" w="100%" minH="100vh">
      <InnerHeader title="ROLETINHA" saldo={saldo} onBack={onBack} />

      <Box px={4} py={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
        <Flex justify="space-between">
          <Text fontSize="sm" color="gray.600">Apostou:</Text>
          <Text fontSize="sm" fontWeight="bold" color="red.500">- {formatBRL(totalApostado)}</Text>
        </Flex>
        <Flex justify="space-between" mt={1}>
          <Text fontSize="sm" color="gray.600">Ganhou:</Text>
          <Text fontSize="sm" fontWeight="bold" color="green.500">+ {formatBRL(totalGanho)}</Text>
        </Flex>
      </Box>

      {dados.length === 0
        ? <Text p={8} textAlign="center" color="gray.400">Nenhuma aposta de Roletinha encontrada</Text>
        : (
          <VStack spacing={0} align="stretch">
            {dados.map(a => (
              <Flex key={a.id} px={4} py={3} align="center"
                borderBottom="1px solid" borderColor="gray.100">
                <Box>
                  <Text fontSize="sm" fontWeight="bold">{formatBRL(a.valor)}</Text>
                  <Text fontSize="xs" color="gray.400">
                    {new Date(a.data).toLocaleDateString('pt-BR')}
                  </Text>
                </Box>
                <Spacer />
                <Badge colorScheme={a.status === 'ganhou' ? 'green' : 'gray'}>
                  {a.status === 'ganhou' ? `+ ${formatBRL(a.premio)}` : 'Não ganhou'}
                </Badge>
              </Flex>
            ))}
          </VStack>
        )
      }
    </Box>
  );
}

// ── Sub-tela: RASPADINHA ───────────────────────────────────────────────────────
function RaspadinhaRelView({ onBack, saldo, apostas }) {
  const dados = apostas.filter(a => a.tipo === 'raspadinha');
  const totalApostado = dados.reduce((s, a) => s + a.valor, 0);
  const totalGanho = dados.filter(a => a.status === 'ganhou').reduce((s, a) => s + (a.premio || 0), 0);

  return (
    <Box bg="white" w="100%" minH="100vh">
      <InnerHeader title="RASPADINHA" saldo={saldo} onBack={onBack} />

      <Box px={4} py={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
        <Flex justify="space-between">
          <Text fontSize="sm" color="gray.600">Apostou:</Text>
          <Text fontSize="sm" fontWeight="bold" color="red.500">- {formatBRL(totalApostado)}</Text>
        </Flex>
        <Flex justify="space-between" mt={1}>
          <Text fontSize="sm" color="gray.600">Ganhou:</Text>
          <Text fontSize="sm" fontWeight="bold" color="green.500">+ {formatBRL(totalGanho)}</Text>
        </Flex>
      </Box>

      {dados.length === 0
        ? <Text p={8} textAlign="center" color="gray.400">Nenhuma aposta de Raspadinha encontrada</Text>
        : (
          <VStack spacing={0} align="stretch">
            {dados.map(a => (
              <Flex key={a.id} px={4} py={3} align="center"
                borderBottom="1px solid" borderColor="gray.100">
                <Box>
                  <Text fontSize="sm" fontWeight="bold">{formatBRL(a.valor)}</Text>
                  <Text fontSize="xs" color="gray.400">
                    {new Date(a.data).toLocaleDateString('pt-BR')}
                  </Text>
                </Box>
                <Spacer />
                <Badge colorScheme={a.status === 'ganhou' ? 'green' : 'gray'}>
                  {a.status === 'ganhou' ? `+ ${formatBRL(a.premio)}` : 'Não ganhou'}
                </Badge>
              </Flex>
            ))}
          </VStack>
        )
      }
    </Box>
  );
}

// ── Sub-tela: MOVIMENTO LOTERIAS ───────────────────────────────────────────────
function MovimentoLoteriasView({ onBack, saldo, apostas, currentUser }) {
  const [diaAberto, setDiaAberto] = useState(null);
  const dias = ultimos7Dias();
  const lotApostas = apostas.filter(a =>
    a.tipo === 'loterias' || a.tipo === 'quininha' || a.tipo === 'lotinha'
  );
  const agrupadas = agruparPorData(lotApostas);

  if (diaAberto) {
    const apostasNoDia = agrupadas[diaAberto] || [];
    const totalVendas = apostasNoDia.reduce((s, a) => s + a.valor, 0);
    const totalPremios = apostasNoDia
      .filter(a => a.status === 'ganhou')
      .reduce((s, a) => s + (a.premio || 0), 0);

    return (
      <Box bg="white" w="100%" minH="100vh">
        <InnerHeader title="MOVIMENTO LOTERIAS" saldo={saldo} onBack={() => setDiaAberto(null)} />
        <Box p={4}>
          {/* Cabeçalho estilo recibo */}
          <Text fontWeight="bold" fontSize="lg" textAlign="center" mb={1}>ZBIXO</Text>
          <Flex justify="space-between" mb={1}>
            <Text fontSize="xs" fontWeight="bold">VENDEDOR</Text>
            <Text fontSize="xs">{currentUser?.unidade || '#00000'}</Text>
          </Flex>
          <Flex justify="space-between" mb={3}>
            <Text fontSize="xs">{diaAberto}</Text>
            <Text fontSize="xs">{new Date().toLocaleTimeString('pt-BR')}</Text>
          </Flex>
          <Divider mb={3} />

          <Text fontWeight="bold" textAlign="center" fontSize="sm" mb={2}>
            MOVIMENTO LOTERIAS — {diaAberto}
          </Text>
          <Divider mb={3} />

          {apostasNoDia.length === 0 ? (
            <Text textAlign="center" color="gray.400" mt={6}>
              NÃO HÁ MOVIMENTO NA DATA
            </Text>
          ) : (
            <VStack spacing={2} align="stretch" mb={4}>
              {apostasNoDia.map(a => (
                <Flex key={a.id} justify="space-between" py={2}
                  borderBottom="1px dashed" borderColor="gray.200">
                  <Box>
                    <Text fontSize="xs" fontWeight="bold">{a.descricao}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {Array.isArray(a.palpites) ? a.palpites.join('-') : a.palpites}
                    </Text>
                    <Text fontSize="xs" color="gray.400">Cód: {a.codigo}</Text>
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="red.500">
                    - {formatBRL(a.valor)}
                  </Text>
                </Flex>
              ))}
            </VStack>
          )}

          <Divider mb={2} />
          <Flex justify="space-between" mb={1}>
            <Text fontSize="sm" fontWeight="bold">TOTAL VENDAS JB:</Text>
            <Text fontSize="sm" color="red.500">- {formatBRL(totalVendas)}</Text>
          </Flex>
          <Flex justify="space-between" mb={4}>
            <Text fontSize="sm" fontWeight="bold">TOTAL PRÊMIOS:</Text>
            <Text fontSize="sm" color="green.500">+ {formatBRL(totalPremios)}</Text>
          </Flex>

          <Button w="full" bg="black" color="white" h="50px"
            onClick={() => {
              const texto = `ZBIXO — MOVIMENTO LOTERIAS\n${diaAberto}\n` +
                apostasNoDia.map(a => `${a.descricao} — ${formatBRL(a.valor)}`).join('\n') +
                `\n\nTOTAL: ${formatBRL(totalVendas)}`;
              navigator.clipboard?.writeText(texto).catch(() => {});
            }}>
            📄 Compartilhar
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="white" w="100%" minH="100vh">
      <InnerHeader title="MOVIMENTO LOTERIAS" saldo={saldo} onBack={onBack} />
      <VStack spacing={0} align="stretch">
        {dias.map(dia => (
          <Flex key={dia} px={4} py={4} align="center"
            borderBottom="1px solid" borderColor="gray.100"
            cursor="pointer" _hover={{ bg: 'gray.50' }}
            onClick={() => setDiaAberto(dia)}>
            <Text fontSize="sm">{dia}</Text>
            <Spacer />
            {agrupadas[dia] && (
              <Text fontSize="xs" color="gray.400" mr={2}>
                {agrupadas[dia].length} aposta(s)
              </Text>
            )}
            <Icon as={FaChevronRight} color="gray.400" boxSize={4} />
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

// ── Sub-tela: COTAÇÕES ─────────────────────────────────────────────────────────
function CotacoesRelView({ onBack, saldo, setAppView }) {
  return (
    <Box bg="white" w="100%" minH="100vh">
      <InnerHeader title="COTAÇÕES" saldo={saldo} onBack={onBack} />
      <VStack spacing={0} align="stretch">
        {['LOTERIAS', 'QUININHA', 'SENINHA', 'LOTINHA'].map(c => (
          <Flex key={c} px={4} py={4} align="center"
            borderBottom="1px solid" borderColor="gray.100"
            cursor="pointer" _hover={{ bg: 'gray.50' }}
            onClick={() => c === 'LOTERIAS' && setAppView('loteriasCotacao')}>
            <Text fontSize="sm" fontWeight="bold" color="#000080">{c}</Text>
            <Spacer />
            <Icon as={FaChevronRight} color="gray.400" boxSize={4} />
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
function RelatoriosView({ setAppView, onMenuOpen, currentUser, apostas = [], transacoes = [] }) {
  const [subView, setSubView] = useState(null);
  const [vis, setVis] = useState(false);
  const saldo = currentUser?.saldo || 0;

  const voltar = () => setSubView(null);
  const props = { onBack: voltar, saldo, apostas, transacoes, currentUser, setAppView };

  if (subView === 'saldo')     return <SaldoView {...props} />;
  if (subView === 'pules')     return <PulesView {...props} />;
  if (subView === 'fazendinha')return <FazendinhaRelView {...props} />;
  if (subView === 'roletinha') return <RoletinhaRelView {...props} />;
  if (subView === 'raspadinha')return <RaspadinhaRelView {...props} />;
  if (subView === 'movimento') return <MovimentoLoteriasView {...props} />;
  if (subView === 'cotacoes')  return <CotacoesRelView {...props} />;

  return (
    <Box bg="white" w="100%" minH="100vh">
      {/* Header preto */}
      <Flex as="header" align="center" p={4} bg="black" color="white">
        <Icon as={FaArrowLeft} boxSize={5} cursor="pointer" onClick={() => setAppView('dashboard')} />
        <Spacer />
        <Text fontWeight="bold" fontSize="13px" letterSpacing="1px">RELATÓRIOS</Text>
        <Spacer />
        <Text fontSize="20px" cursor="pointer" onClick={onMenuOpen}>☰</Text>
      </Flex>

      {/* Barra azul com saldo */}
      <Flex align="center" px={4} py={3} bg="#000080" color="white">
        <Icon as={FaRotateRight} boxSize={4} cursor="pointer" />
        <Spacer />
        <Text fontWeight="bold" fontSize="16px">
          {vis ? formatBRL(saldo) : 'R$ *****,**'}
        </Text>
        <Icon as={vis ? FaEyeSlash : FaEye} boxSize={4} ml={2} cursor="pointer"
          onClick={() => setVis(v => !v)} />
      </Flex>

      {/* Lista */}
      <VStack spacing={0} align="stretch">
        <ReportItem icon={FaDollarSign}   text="SALDO"              onClick={() => setSubView('saldo')} />
        <ReportItem icon={FaFileInvoice}  text="PULES"              onClick={() => setSubView('pules')} />
        <ReportItem icon={FaPersonDigging} text="FAZENDINHA"        onClick={() => setSubView('fazendinha')} />
        <ReportItem icon={FaDice}         text="ROLETINHA"          onClick={() => setSubView('roletinha')} />
        <ReportItem icon={FaDice}         text="RASPADINHA"         onClick={() => setSubView('raspadinha')} />
        <ReportItem icon={FaDollarSign}   text="MOVIMENTO LOTERIAS" onClick={() => setSubView('movimento')} />
        <ReportItem icon={FaTags}         text="COTAÇÕES"           onClick={() => setSubView('cotacoes')} />
      </VStack>
    </Box>
  );
}

export default RelatoriosView;