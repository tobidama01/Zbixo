import React, { useState } from 'react';
import {
  Box, Flex, VStack, Text, Button, Icon,
  Spacer, Heading, Divider
} from '@chakra-ui/react';
import {
  FaBars, FaRotateRight,
  FaArrowLeft, FaChevronRight,
  FaEye, FaEyeSlash
} from 'react-icons/fa6';

const CotacaoItem = ({ text, ...props }) => (
  <Flex
    as="button"
    w="100%"
    p={4}
    align="center"
    borderBottom="1px solid"
    borderColor="#EDF2F7"
    _hover={{ bg: '#F7FAFC' }}
    {...props}
  >
    <Text fontWeight="bold">{text}</Text>
    <Spacer />
    <Icon as={FaChevronRight} color="#A0AEC0" />
  </Flex>
);

function CotacoesView({ setAppView, onMenuOpen }) {

  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  return (
    <Box
      bg="white"
      w="100%"
      minH="100vh"
      color="black"
      border="1px solid"
      borderColor="#EDF2F7"
    >

      <Flex
        as="header" align="center" p={4}
        bg="#1A202C" color="white"
      >
        <Icon as={FaArrowLeft} boxSize={6} cursor="pointer" onClick={() => setAppView('relatorios')} />
        <Spacer />
        <Heading fontSize="12px">COTAÇÕES</Heading>
        <Spacer />
        <Icon as={FaBars} boxSize={6} onClick={onMenuOpen} cursor="pointer" />
      </Flex>

      <Flex
        align="center"
        p={3}
        bg="#2B6CB0"
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

      <VStack spacing={0} p={0} align="stretch">

        <CotacaoItem text="LOTERIAS" onClick={() => setAppView('loteriasCotacao')} />

        <CotacaoItem text="QUININHA" />
        <CotacaoItem text="SENINHA" />
        <CotacaoItem text="LOTINHA" />
      </VStack>

    </Box>
  );
}

export default CotacoesView;
