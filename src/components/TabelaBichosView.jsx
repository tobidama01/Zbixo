import React, { useState } from 'react';
import {
  Box, Flex, VStack, Text, Image, Button, Icon,
  SimpleGrid, Divider, Spacer, Heading
} from '@chakra-ui/react';
import {
  FaBars, FaEye, FaEyeSlash, FaRotateRight,
  FaArrowLeft
} from 'react-icons/fa6';

const bichosData = [
  { n: '01', img: './img/01.webp', nums: '01 02 03 04' },
  { n: '02', img: './img/02.webp', nums: '05 06 07 08' },
  { n: '03', img: './img/03.webp', nums: '09 10 11 12' },
  { n: '04', img: './img/04.webp', nums: '13 14 15 16' },
  { n: '05', img: './img/05.webp', nums: '17 18 19 20' },
  { n: '06', img: './img/06.webp', nums: '21 22 23 24' },
  { n: '07', img: './img/07.webp', nums: '25 26 27 28' },
  { n: '08', img: './img/08.webp', nums: '29 30 31 32' },
  { n: '09', img: './img/09.webp', nums: '33 34 35 36' },
  { n: '10', img: './img/10.webp', nums: '37 38 39 40' },
  { n: '11', img: './img/11.webp', nums: '41 42 43 44' },
  { n: '12', img: './img/12.webp', nums: '45 46 47 48' },
  { n: '13', img: './img/13.webp', nums: '49 50 51 52' },
  { n: '14', img: './img/14.webp', nums: '53 54 55 56' },
  { n: '15', img: './img/15.webp', nums: '57 58 59 60' },
  { n: '16', img: './img/16.webp', nums: '61 62 63 64' },
  { n: '17', img: './img/17.webp', nums: '65 66 67 68' },
  { n: '18', img: './img/18.webp', nums: '69 70 71 72' },
  { n: '19', img: './img/19.webp', nums: '73 74 75 76' },
  { n: '20', img: './img/20.webp', nums: '77 78 79 80' },
  { n: '21', img: './img/21.webp', nums: '81 82 83 84' },
  { n: '22', img: './img/22.webp', nums: '85 86 87 88' },
  { n: '23', img: './img/23.webp', nums: '89 90 91 92' },
  { n: '24', img: './img/24.webp', nums: '93 94 95 96' },
  { n: '25', img: './img/25.webp', nums: '97 98 99 00' },
];

const BichoCard = ({ bicho }) => (
  <Box
    position="relative"
    bg="white"
    border="1px solid"
    borderColor="#EDF2F7"
    borderRadius="lg"
    p={2}
    boxShadow="0 1px 3px rgba(0,0,0,0.06)"
  >
    <Text
      position="absolute"
      top="8px"
      left="8px"
      fontWeight="bold"
      fontSize="13px"
    >
      {bicho.n}
    </Text>

    <VStack spacing={1} align="center" pt={5}>
      <Image src={bicho.img} alt={`Bicho ${bicho.n}`} boxSize="50px" objectFit="contain" />
      <Text
        fontSize="10px"
        color="#4A5568"
        fontWeight="bold"
        whiteSpace="nowrap"
      >
        {bicho.nums}
      </Text>
    </VStack>
  </Box>
);


function TabelaBichosView({ setAppView, onMenuOpen }) {

  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  return (
    <Box
      bg="#F7FAFC"
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
        <Icon as={FaArrowLeft} boxSize={6} cursor="pointer" onClick={() => setAppView('tipoDeJogo')} />
        <Spacer />
        <Heading fontSize="12px">ZBIXO</Heading>
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

      <VStack spacing={4} p={4} align="stretch">

        <Heading
          size="sm"
          textAlign="left"
          mb={2}
        >
          Tabela de Bichos
        </Heading>

        <SimpleGrid columns={4} spacing={3}>
          {bichosData.map((bicho) => (
            <BichoCard key={bicho.n} bicho={bicho} />
          ))}
        </SimpleGrid>

      </VStack>

    </Box>
  );
}

export default TabelaBichosView;
