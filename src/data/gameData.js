// src/data/gameData.js

export const BICHOS = [
  { grupo: 1, nome: 'Avestruz', dezenas: ['01','02','03','04'], img: '/img/01.webp' },
  { grupo: 2, nome: 'Águia',    dezenas: ['05','06','07','08'], img: '/img/02.webp' },
  { grupo: 3, nome: 'Burro',    dezenas: ['09','10','11','12'], img: '/img/03.webp' },
  { grupo: 4, nome: 'Borboleta',dezenas: ['13','14','15','16'], img: '/img/04.webp' },
  { grupo: 5, nome: 'Cachorro', dezenas: ['17','18','19','20'], img: '/img/05.webp' },
  { grupo: 6, nome: 'Cabra',    dezenas: ['21','22','23','24'], img: '/img/06.webp' },
  { grupo: 7, nome: 'Carneiro', dezenas: ['25','26','27','28'], img: '/img/07.webp' },
  { grupo: 8, nome: 'Camelo',   dezenas: ['29','30','31','32'], img: '/img/08.webp' },
  { grupo: 9, nome: 'Cobra',    dezenas: ['33','34','35','36'], img: '/img/09.webp' },
  { grupo:10, nome: 'Coelho',   dezenas: ['37','38','39','40'], img: '/img/10.webp' },
  { grupo:11, nome: 'Cavalo',   dezenas: ['41','42','43','44'], img: '/img/11.webp' },
  { grupo:12, nome: 'Elefante', dezenas: ['45','46','47','48'], img: '/img/12.webp' },
  { grupo:13, nome: 'Galo',     dezenas: ['49','50','51','52'], img: '/img/13.webp' },
  { grupo:14, nome: 'Gato',     dezenas: ['53','54','55','56'], img: '/img/14.webp' },
  { grupo:15, nome: 'Jacaré',   dezenas: ['57','58','59','60'], img: '/img/15.webp' },
  { grupo:16, nome: 'Leão',     dezenas: ['61','62','63','64'], img: '/img/16.webp' },
  { grupo:17, nome: 'Macaco',   dezenas: ['65','66','67','68'], img: '/img/17.webp' },
  { grupo:18, nome: 'Porco',    dezenas: ['69','70','71','72'], img: '/img/18.webp' },
  { grupo:19, nome: 'Pavão',    dezenas: ['73','74','75','76'], img: '/img/19.webp' },
  { grupo:20, nome: 'Peru',     dezenas: ['77','78','79','80'], img: '/img/20.webp' },
  { grupo:21, nome: 'Touro',    dezenas: ['81','82','83','84'], img: '/img/21.webp' },
  { grupo:22, nome: 'Tigre',    dezenas: ['85','86','87','88'], img: '/img/22.webp' },
  { grupo:23, nome: 'Urso',     dezenas: ['89','90','91','92'], img: '/img/23.webp' },
  { grupo:24, nome: 'Veado',    dezenas: ['93','94','95','96'], img: '/img/24.webp' },
  { grupo:25, nome: 'Vaca',     dezenas: ['97','98','99','00'], img: '/img/25.webp' },
];

// Modalidades do Jogo do Bicho com multiplicadores
export const MODALIDADES_LOTERIAS = [
  // Centena
  { id: 'centena',          nome: 'CENTENA',            multiplicador: 800,   digitos: 3, tipo: 'centena' },
  { id: 'centena_inv',      nome: 'CENTENA INV',        multiplicador: 800,   digitos: 3, tipo: 'centena' },
  { id: 'centena_esq',      nome: 'CENTENA ESQUERDA',   multiplicador: 800,   digitos: 3, tipo: 'centena' },
  // Milhar
  { id: 'milhar',           nome: 'MILHAR',             multiplicador: 8000,  digitos: 4, tipo: 'milhar' },
  { id: 'milhar_inv',       nome: 'MILHAR INV',         multiplicador: 8000,  digitos: 4, tipo: 'milhar' },
  // Dezena
  { id: 'dezena',           nome: 'DEZENA',             multiplicador: 80,    digitos: 2, tipo: 'dezena' },
  { id: 'dezena_esq',       nome: 'DEZENA ESQ',         multiplicador: 80,    digitos: 2, tipo: 'dezena' },
  { id: 'dezena_meio',      nome: 'DEZENA MEIO',        multiplicador: 80,    digitos: 2, tipo: 'dezena' },
  // Unidade
  { id: 'unidade',          nome: 'UNIDADE',            multiplicador: 8,     digitos: 1, tipo: 'unidade' },
  // Grupo
  { id: 'grupo',            nome: 'GRUPO',              multiplicador: 20,    digitos: 2, tipo: 'grupo' },
  { id: 'duque_gp',         nome: 'DUQUE GP',           multiplicador: 180,   digitos: 2, tipo: 'grupo' },
  { id: 'terno_gp',         nome: 'TERNO GP',           multiplicador: 1500,  digitos: 2, tipo: 'grupo' },
  { id: 'quadra_gp',        nome: 'QUADRA GP',          multiplicador: 1000,  digitos: 2, tipo: 'grupo' },
  // Duques e Ternos de dezena
  { id: 'duque_dez',        nome: 'DUQUE DEZ',          multiplicador: 150,   digitos: 2, tipo: 'dezena' },
  { id: 'duque_dez_esq',    nome: 'DUQUE DEZ ESQ',      multiplicador: 150,   digitos: 2, tipo: 'dezena' },
  { id: 'duque_dez_meio',   nome: 'DUQUE DEZ MEIO',     multiplicador: 300,   digitos: 2, tipo: 'dezena' },
  { id: 'terno_dez_seco',   nome: 'TERNO DEZ SECO',     multiplicador: 10000, digitos: 2, tipo: 'dezena' },
  { id: 'terno_dez',        nome: 'TERNO DEZ',          multiplicador: 5000,  digitos: 2, tipo: 'dezena' },
  // Passe
  { id: 'passe_vai',        nome: 'PASSE VAI',          multiplicador: 100,   digitos: 2, tipo: 'dezena' },
  { id: 'passe_vai_vem',    nome: 'PASSE VAI VEM',      multiplicador: 45,    digitos: 2, tipo: 'dezena' },
  // Palpitão
  { id: 'palpitao',         nome: 'PALPITAO',           multiplicador: 800,   digitos: 3, tipo: 'centena' },
];

// Modalidades da Quininha (com quantidade de dígitos)
export const MODALIDADES_QUININHA = [
  { id: 'quininha_13d', nome: 'QUININHA 13D', multiplicador: 5000,  minDig: 13 },
  { id: 'quininha_14d', nome: 'QUININHA 14D', multiplicador: 3900,  minDig: 14 },
  { id: 'quininha_15d', nome: 'QUININHA 15D', multiplicador: 2700,  minDig: 15 },
  { id: 'quininha_16d', nome: 'QUININHA 16D', multiplicador: 2200,  minDig: 16 },
  { id: 'quininha_17d', nome: 'QUININHA 17D', multiplicador: 1600,  minDig: 17 },
  { id: 'quininha_18d', nome: 'QUININHA 18D', multiplicador: 1100,  minDig: 18 },
  { id: 'quininha_19d', nome: 'QUININHA 19D', multiplicador: 800,   minDig: 19 },
  { id: 'quininha_20d', nome: 'QUININHA 20D', multiplicador: 700,   minDig: 20 },
  { id: 'quininha_25d', nome: 'QUININHA 25D', multiplicador: 180,   minDig: 25 },
  { id: 'quininha_30d', nome: 'QUININHA 30D', multiplicador: 65,    minDig: 30 },
  { id: 'quininha_35d', nome: 'QUININHA 35D', multiplicador: 29,    minDig: 35 },
  { id: 'quininha_40d', nome: 'QUININHA 40D', multiplicador: 10,    minDig: 40 },
  { id: 'quininha_45d', nome: 'QUININHA 45D', multiplicador: 7,     minDig: 45 },
];

// Modalidades da Lotinha
export const MODALIDADES_LOTINHA = [
  { id: 'lotinha_16d', nome: 'LOTINHA 16D', multiplicador: 5000, minDig: 16 },
  { id: 'lotinha_17d', nome: 'LOTINHA 17D', multiplicador: 200,  minDig: 17 },
  { id: 'lotinha_18d', nome: 'LOTINHA 18D', multiplicador: 100,  minDig: 18 },
  { id: 'lotinha_19d', nome: 'LOTINHA 19D', multiplicador: 50,   minDig: 19 },
  { id: 'lotinha_20d', nome: 'LOTINHA 20D', multiplicador: 25,   minDig: 20 },
  { id: 'lotinha_21d', nome: 'LOTINHA 21D', multiplicador: 15,   minDig: 21 },
  { id: 'lotinha_22d', nome: 'LOTINHA 22D', multiplicador: 8,    minDig: 22 },
];

// Colocações (prêmios) disponíveis para Loterias
export const COLOCACOES_LOTERIAS = [
  { id: '1premio',    nome: '1 PRÊMIO',    fator: 1.0  },
  { id: '2premio',    nome: '2 PRÊMIO',    fator: 0.9  },
  { id: '3premio',    nome: '3 PRÊMIO',    fator: 0.8  },
  { id: '4premio',    nome: '4 PRÊMIO',    fator: 0.7  },
  { id: '5premio',    nome: '5 PRÊMIO',    fator: 0.6  },
  { id: '6premio',    nome: '6 PRÊMIO',    fator: 0.5  },
  { id: '7premio',    nome: '7 PRÊMIO',    fator: 0.4  },
  { id: '8premio',    nome: '8 PRÊMIO',    fator: 0.3  },
  { id: '9premio',    nome: '9 PRÊMIO',    fator: 0.25 },
  { id: '10premio',   nome: '10 PRÊMIO',   fator: 0.2  },
  { id: '1_5premio',  nome: '1/5 PRÊMIO',  fator: 0.2  },
  { id: '1_10premio', nome: '1/10 PRÊMIO', fator: 0.1  },
];

// Loterias disponíveis (referências para extração)
export const LOTERIAS = [
  { id: 'federal',    nome: 'RIO/FEDERAL'       },
  { id: 'nacional',   nome: 'NACIONAL'          },
  { id: 'look',       nome: 'LOOK/GOIAS'        },
  { id: 'lotep',      nome: 'LOTEP'             },
  { id: 'bahia',      nome: 'BAHIA'             },
  { id: 'lotece',     nome: 'LOTECE'            },
  { id: 'sp',         nome: 'SÃO-PAULO'         },
  { id: 'sorte',      nome: 'SORTE'             },
  { id: 'mg',         nome: 'MINAS-GERAIS'      },
  { id: 'boasorte',   nome: 'BOASORTE/GOIAS'    },
];

// Horários de extração
export const HORARIOS_EXTRACAO = [
  { id: 'lt_nacional_21', nome: 'LT NACIONAL 21HS',  hora: '21:00' },
  { id: 'lt_bahia_21',    nome: 'LT BAHIA 21HS',     hora: '21:00' },
  { id: 'lt_boasorte_21', nome: 'LT BOASORTE 21HS',  hora: '21:10' },
  { id: 'lt_look_21',     nome: 'LT LOOK 21HS',      hora: '21:15' },
  { id: 'lt_nacional_23', nome: 'LT NACIONAL 23HS',  hora: '23:00' },
  { id: 'lt_look_23',     nome: 'LT LOOK 23HS',      hora: '23:00' },
  { id: 'lt_ptrio_21',    nome: 'LT PT RIO 21HS',    hora: '21:05' },
];

// Sonhos e seus números correspondentes
export const SONHOS = [
  { termo: 'água', numeros: ['01','02','03'] },
  { termo: 'amor', numeros: ['14','15'] },
  { termo: 'avião', numeros: ['41','42'] },
  { termo: 'bebê', numeros: ['09','10'] },
  { termo: 'cachorro', numeros: ['05','06','07','08'] },
  { termo: 'carro', numeros: ['21','22'] },
  { termo: 'casa', numeros: ['45','46'] },
  { termo: 'cavalo', numeros: ['41','42','43','44'] },
  { termo: 'cobra', numeros: ['33','34','35','36'] },
  { termo: 'dinheiro', numeros: ['97','98','99','00'] },
  { termo: 'elefante', numeros: ['45','46','47','48'] },
  { termo: 'estrela', numeros: ['73','74'] },
  { termo: 'festa', numeros: ['17','18'] },
  { termo: 'fogo', numeros: ['61','62'] },
  { termo: 'gato', numeros: ['53','54','55','56'] },
  { termo: 'morte', numeros: ['81','82'] },
  { termo: 'mulher', numeros: ['53','54'] },
  { termo: 'onça', numeros: ['85','86'] },
  { termo: 'peixe', numeros: ['89','90'] },
  { termo: 'sangue', numeros: ['57','58'] },
  { termo: 'telefone', numeros: ['33','34'] },
  { termo: 'vaca', numeros: ['97','98','99','00'] },
];
