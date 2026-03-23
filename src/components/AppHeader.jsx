// src/components/AppHeader.jsx
import React, { useState } from 'react';
import { Flex, Icon, Spacer, Heading, Text, Box } from '@chakra-ui/react';
import { FaHouse, FaBars, FaArrowLeft, FaRotateRight, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { formatBRL } from '../utils/helpers';

function AppHeader({ title, saldo = 0, onHome, onBack, onMenuOpen, showBalance = true }) {
  const [balanceVisible, setBalanceVisible] = useState(false);

  return (
    <>
      <Flex as="header" align="center" p={4} bg="black" color="white">
        {onBack
          ? <Icon as={FaArrowLeft} boxSize={6} cursor="pointer" onClick={onBack} />
          : <Icon as={FaHouse} boxSize={6} cursor="pointer" onClick={onHome} />
        }
        <Spacer />
        <Heading fontSize="13px" letterSpacing="1px">{title}</Heading>
        <Spacer />
        <Icon as={FaBars} boxSize={6} onClick={onMenuOpen} cursor="pointer" />
      </Flex>

      {showBalance && (
        <Flex align="center" p={3} bg="#000080" color="white">
          <Icon as={FaRotateRight} boxSize={5} cursor="pointer" />
          <Spacer />
          <Text fontWeight="bold" fontSize="17px">
            {balanceVisible ? formatBRL(saldo) : 'R$ *****,**'}
          </Text>
          <Box ml={2} cursor="pointer" onClick={() => setBalanceVisible(v => !v)}>
            <Icon as={balanceVisible ? FaEyeSlash : FaEye} boxSize={5} />
          </Box>
        </Flex>
      )}
    </>
  );
}

export default AppHeader;
