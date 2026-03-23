import React, { useState } from 'react';
import {
  Box, Flex, VStack, Text, Button, Icon,
  Spacer, Heading, Divider
} from '@chakra-ui/react';
import { 
  FaBars, FaRotateRight, 
  FaEye, FaEyeSlash, 
  FaArrowLeft, 
  FaFileLines
} from 'react-icons/fa6';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const cotacoesData = [
  { nome: 'CENTENA', valor: 'R$ 920,00' },
  { nome: 'MILHAR', valor: 'R$ 9.200,00' },
  { nome: 'MILHAR BRINDE!', valor: 'R$ 100,00' },
  { nome: 'UNIDADE', valor: 'R$ 9,20' },
  { nome: 'DEZENA', valor: 'R$ 92,00' },
  { nome: 'DUQUE DEZ', valor: 'R$ 300,00' },
  { nome: 'TERNO DEZ SECO', valor: 'R$ 10.000,00' },
  { nome: 'TERNO DEZ', valor: 'R$ 5.000,00' },
  { nome: 'GRUPO', valor: 'R$ 23,00' },
  { nome: 'DUQUE GP', valor: 'R$ 180,00' },
  { nome: 'TERNO GP', valor: 'R$ 150,00' },
  { nome: 'QUADRA GP', valor: 'R$ 100,00' },
  { nome: 'PALPITAO', valor: 'R$ 80,00' },
  { nome: 'PASSE VAI', valor: 'R$ 45,00' },
  { nome: 'PASSE VAI VEM', valor: 'R$ 45,00' }, 
];

const CotacaoRow = ({ nome, valor }) => (
  <Flex justify="space-between" py={2} borderBottom="1px solid" borderColor="gray.200">
    <Text>{nome}</Text>
    <Text>{valor}</Text> 
  </Flex>
);

function LoteriasCotacaoView({ setAppView, onMenuOpen, currentUser }) {
  
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dataExibicao = new Date().toLocaleDateString('pt-BR');
  const horaExibicao = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const handleShare = () => {
    setIsLoading(true);
    const pdfContent = document.getElementById('pdf-content-wrapper');
    const dataAtual = new Date();
    const horaFormatada = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '');
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR').replace
    const fileName = `cotacao_ZBIXO_${dataFormatada}_${horaFormatada}.pdf`;

    html2canvas(pdfContent, { 
      scale: 2,
      useCORS: true 
    }).then((canvas) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const pdfWidth = 210; 
      const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth; 

      const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]); 

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(fileName);
      setIsLoading(false);
    });
  };

  return (
    <Box 
      bg="white"
      w="100%" 
      minH="100vh" 
      color="black"
      border="1px solid"
      borderColor="gray.300"
    >
      
      <Flex 
        as="header" align="center" p={4} 
        bg="black" color="white"
      >
        <Icon as={FaArrowLeft} boxSize={6} cursor="pointer" onClick={() => setAppView('cotacoes')} />
        <Spacer />
        <Heading fontSize="12px">ZBIXO</Heading>
        <Spacer />
        <Icon as={FaBars} boxSize={6} onClick={onMenuOpen} cursor="pointer" />
      </Flex>

      <Flex 
        align="center" 
        p={3} 
        bg="#000080" 
        color="white"
      >
        <Icon as={FaRotateRight} boxSize={5} cursor="pointer" />
        <Spacer /> 
        <Text 
          fontWeight="bold" 
          fontSize="18px" 
          color="white"
        >
          {isBalanceVisible ? 'R$ 1.234,56' : 'R$ ****,**'}
        </Text>
        <Icon 
          as={isBalanceVisible ? FaEyeSlash : FaEye}
          boxSize={5} 
          cursor="pointer"
          color="white"
          onClick={() => setIsBalanceVisible(!isBalanceVisible)}
          ml={2} 
        />
      </Flex>
      
      <VStack spacing={4} p={4} align="stretch" bg="white">

        <VStack id="pdf-content-wrapper" spacing={4} align="stretch">
          
          <Heading size="md" textAlign="center" my={2}>
            ZBIXO
          </Heading>

          <Flex justify="space-between" fontSize="sm">
            <VStack align="flex-start" spacing={0}>
              <Text fontWeight="bold">VENDEDOR</Text>
              <Text>{dataExibicao}</Text>
            </VStack>
            <VStack align="flex-end" spacing={0}>
              <Text>{currentUser?.unidade || '#00000'}</Text>
              <Text>{horaExibicao}</Text>
            </VStack>
          </Flex>
          
          <Divider />

          <Flex justify="space-between" fontSize="sm">
            <VStack align="flex-start" spacing={0}>
              <Text fontWeight="bold">TABELA DE COTAÇÃO</Text>
              <Text>VALOR PRA CADA</Text>
            </VStack>
            <VStack align="flex-end" spacing={0}>
              <Text>ON-LINE</Text>
              <Text>R$ 1,00</Text>
            </VStack>
          </Flex>

          <Divider />
          
          <Box textAlign="center" py={2}>
            <Text fontWeight="bold" fontSize="sm">PARA DUQUE GP e TERNO GP</Text>
            <Text fontSize="xs">VALOR VÁLIDO PARA APOSTA SECA</Text>
          </Box>

          <VStack spacing={0} align="stretch" bg="white" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
            {cotacoesData.map((cotacao) => (
              <CotacaoRow key={cotacao.nome} nome={cotacao.nome} valor={cotacao.valor} />
            ))}
          </VStack>
        
        </VStack> 

        <Button 
          colorScheme="blackBtn" 
          color="white" 
          height="50px" 
          leftIcon={<Icon as={FaFileLines} />}
          onClick={handleShare}
          isLoading={isLoading}
          loadingText="A gerar PDF..."
        >
          Compartilhar
        </Button>
        
      </VStack>
      
    </Box>
  );
}

export default LoteriasCotacaoView;