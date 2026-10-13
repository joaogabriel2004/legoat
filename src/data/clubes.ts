export interface Clube {
  nome: string;
  pais: string;
  liga: string;
  divisao: 1 | 2;
  reputacao: number; // 1 (Base/Regional) a 5 (Elite Mundial)
}

export const BANCO_DE_CLUBES: Clube[] = [
  // ==========================================
  // 🇺🇸 NBA — ESTADOS UNIDOS
  // ==========================================
  { nome: "Atlanta Hawks", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "Brooklyn Nets", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "New York Knicks", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 5 },
  { nome: "Philadelphia 76ers", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 5 },
  { nome: "Toronto Raptors", pais: "Canadá", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "Chicago Bulls", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "Cleveland Cavaliers", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 5 },
  { nome: "Detroit Pistons", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "Indiana Pacers", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "Milwaukee Bucks", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 5 },
  { nome: "Charlotte Hornets", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 3 },
  { nome: "Orlando Magic", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "Washington Wizards", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 3 },
  { nome: "Denver Nuggets", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 5 },
  { nome: "Minnesota Timberwolves", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 5 },
  { nome: "Oklahoma City Thunder", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 5 },
  { nome: "Portland Trail Blazers", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 3 },
  { nome: "Utah Jazz", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 3 },
  { nome: "LA Clippers", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "Phoenix Suns", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "Sacramento Kings", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 3 },
  { nome: "Dallas Mavericks", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 5 },
  { nome: "Houston Rockets", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "Memphis Grizzlies", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 4 },
  { nome: "New Orleans Pelicans", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 3 },
  { nome: "San Antonio Spurs", pais: "EUA", liga: "NBA", divisao: 1, reputacao: 5 },

  // ==========================================
  // 🇧🇷 NBB — BRASIL
  // ==========================================
  { nome: "Botafogo", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },
  { nome: "Brasília Basquete", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 3 },
  { nome: "Caxias do Sul Basquete", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },
  { nome: "Cruzeiro Basquete", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },
  { nome: "Fortaleza Basquete Cearense", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },
  { nome: "Mogi Basquete", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },
  { nome: "Pato Basquete", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },
  { nome: "Pinheiros", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 3 },
  { nome: "Rio Claro Basquete", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },
  { nome: "São José Basketball", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },
  { nome: "União Corinthians", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },
  { nome: "Vasco da Gama", pais: "Brasil", liga: "NBB", divisao: 1, reputacao: 2 },

  // ==========================================
  // 🇪🇸 ESPANHA — LIGA ACB
  // ==========================================
  { nome: "UCAM Murcia", pais: "Espanha", liga: "Liga ACB", divisao: 1, reputacao: 3 },
  { nome: "La Laguna Tenerife", pais: "Espanha", liga: "Liga ACB", divisao: 1, reputacao: 4 },
  { nome: "Bilbao Basket", pais: "Espanha", liga: "Liga ACB", divisao: 1, reputacao: 3 },
  { nome: "Gran Canaria", pais: "Espanha", liga: "Liga ACB", divisao: 1, reputacao: 3 },
  { nome: "Bàsquet Girona", pais: "Espanha", liga: "Liga ACB", divisao: 1, reputacao: 2 },
  { nome: "Bàsquet Manresa", pais: "Espanha", liga: "Liga ACB", divisao: 1, reputacao: 3 },
  { nome: "Casademont Zaragoza", pais: "Espanha", liga: "Liga ACB", divisao: 1, reputacao: 3 },
  { nome: "MoraBanc Andorra", pais: "Andorra", liga: "Liga ACB", divisao: 1, reputacao: 2 },
  { nome: "Leyma Coruña", pais: "Espanha", liga: "Liga ACB", divisao: 1, reputacao: 2 },
  { nome: "Bàsquet Club Obradoiro", pais: "Espanha", liga: "Primera FEB", divisao: 2, reputacao: 2 },

  // ==========================================
  // 🇬🇷 GRÉCIA
  // ==========================================
  { nome: "Olympiacos", pais: "Grécia", liga: "Greek Basket League", divisao: 1, reputacao: 5 },
  { nome: "Panathinaikos", pais: "Grécia", liga: "Greek Basket League", divisao: 1, reputacao: 5 },
  { nome: "AEK Athens", pais: "Grécia", liga: "Greek Basket League", divisao: 1, reputacao: 3 },
  { nome: "Aris Thessaloniki", pais: "Grécia", liga: "Greek Basket League", divisao: 1, reputacao: 3 },
  { nome: "PAOK Thessaloniki", pais: "Grécia", liga: "Greek Basket League", divisao: 1, reputacao: 3 },
  { nome: "Peristeri", pais: "Grécia", liga: "Greek Basket League", divisao: 1, reputacao: 3 },
  { nome: "Iraklis Thessaloniki", pais: "Grécia", liga: "Greek Basket League", divisao: 1, reputacao: 2 },

  // ==========================================
  // 🇹🇷 TURQUIA
  // ==========================================
  { nome: "Fenerbahçe", pais: "Turquia", liga: "Basketbol Süper Ligi", divisao: 1, reputacao: 5 },
  { nome: "Anadolu Efes", pais: "Turquia", liga: "Basketbol Süper Ligi", divisao: 1, reputacao: 5 },
  { nome: "Galatasaray", pais: "Turquia", liga: "Basketbol Süper Ligi", divisao: 1, reputacao: 3 },
  { nome: "Beşiktaş", pais: "Turquia", liga: "Basketbol Süper Ligi", divisao: 1, reputacao: 4 },
  { nome: "Türk Telekom", pais: "Turquia", liga: "Basketbol Süper Ligi", divisao: 1, reputacao: 3 },
  { nome: "Pınar Karşıyaka", pais: "Turquia", liga: "Basketbol Süper Ligi", divisao: 1, reputacao: 3 },
  { nome: "Tofaş Bursa", pais: "Turquia", liga: "Basketbol Süper Ligi", divisao: 1, reputacao: 3 },

  // ==========================================
  // 🇷🇸 SÉRVIA
  // ==========================================
  { nome: "Partizan Belgrade", pais: "Sérvia", liga: "KLS", divisao: 1, reputacao: 5 },
  { nome: "Crvena Zvezda", pais: "Sérvia", liga: "KLS", divisao: 1, reputacao: 5 },
  { nome: "Mega Basket", pais: "Sérvia", liga: "KLS", divisao: 1, reputacao: 3 },
  { nome: "FMP Belgrade", pais: "Sérvia", liga: "KLS", divisao: 1, reputacao: 3 },

  // ==========================================
  // 🇱🇹 LITUÂNIA
  // ==========================================
  { nome: "Žalgiris Kaunas", pais: "Lituânia", liga: "LKL", divisao: 1, reputacao: 5 },
  { nome: "Rytas Vilnius", pais: "Lituânia", liga: "LKL", divisao: 1, reputacao: 4 },
  { nome: "Lietkabelis Panevėžys", pais: "Lituânia", liga: "LKL", divisao: 1, reputacao: 3 },
  { nome: "Neptūnas Klaipėda", pais: "Lituânia", liga: "LKL", divisao: 1, reputacao: 3 },

  // ==========================================
  // 🇦🇺 AUSTRÁLIA — NBL
  // ==========================================
  { nome: "Sydney Kings", pais: "Austrália", liga: "NBL", divisao: 1, reputacao: 4 },
  { nome: "Melbourne United", pais: "Austrália", liga: "NBL", divisao: 1, reputacao: 4 },
  { nome: "Perth Wildcats", pais: "Austrália", liga: "NBL", divisao: 1, reputacao: 4 },
  { nome: "Adelaide 36ers", pais: "Austrália", liga: "NBL", divisao: 1, reputacao: 3 },
  { nome: "Brisbane Bullets", pais: "Austrália", liga: "NBL", divisao: 1, reputacao: 3 },
  { nome: "New Zealand Breakers", pais: "Nova Zelândia", liga: "NBL", divisao: 1, reputacao: 3 },
  { nome: "Cairns Taipans", pais: "Austrália", liga: "NBL", divisao: 1, reputacao: 3 },
  { nome: "Illawarra Hawks", pais: "Austrália", liga: "NBL", divisao: 1, reputacao: 3 },
  { nome: "Tasmania JackJumpers", pais: "Austrália", liga: "NBL", divisao: 1, reputacao: 3 },

  // ==========================================
  // 🇨🇳 CHINA — CBA
  // ==========================================
  { nome: "Guangdong Southern Tigers", pais: "China", liga: "CBA", divisao: 1, reputacao: 4 },
  { nome: "Beijing Ducks", pais: "China", liga: "CBA", divisao: 1, reputacao: 4 },
  { nome: "Liaoning Flying Leopards", pais: "China", liga: "CBA", divisao: 1, reputacao: 4 },
  { nome: "Shanghai Sharks", pais: "China", liga: "CBA", divisao: 1, reputacao: 4 },
  { nome: "Zhejiang Golden Bulls", pais: "China", liga: "CBA", divisao: 1, reputacao: 3 },
  { nome: "Xinjiang Flying Tigers", pais: "China", liga: "CBA", divisao: 1, reputacao: 4 },
  { nome: "Shenzhen Leopards", pais: "China", liga: "CBA", divisao: 1, reputacao: 3 },

  // ==========================================
  // 🇦🇷 ARGENTINA — LIGA NACIONAL
  // ==========================================
  { nome: "Instituto Córdoba", pais: "Argentina", liga: "Liga Nacional", divisao: 1, reputacao: 3 },
  { nome: "Obras Sanitarias", pais: "Argentina", liga: "Liga Nacional", divisao: 1, reputacao: 3 },
  { nome: "Regatas Corrientes", pais: "Argentina", liga: "Liga Nacional", divisao: 1, reputacao: 3 },
  { nome: "Gimnasia de Comodoro", pais: "Argentina", liga: "Liga Nacional", divisao: 1, reputacao: 3 },
  { nome: "Peñarol de Mar del Plata", pais: "Argentina", liga: "Liga Nacional", divisao: 1, reputacao: 3 },
  { nome: "Ferro Carril Oeste", pais: "Argentina", liga: "Liga Nacional", divisao: 1, reputacao: 3 },
  { nome: "Olímpico de La Banda", pais: "Argentina", liga: "Liga Nacional", divisao: 1, reputacao: 2 },

  // ==========================================
  // 🇲🇽 MÉXICO — LNBP
  // ==========================================
  { nome: "Fuerza Regia", pais: "México", liga: "LNBP", divisao: 1, reputacao: 3 },
  { nome: "Soles de Mexicali", pais: "México", liga: "LNBP", divisao: 1, reputacao: 3 },
  { nome: "Astros de Jalisco", pais: "México", liga: "LNBP", divisao: 1, reputacao: 3 },
  { nome: "Diablos Rojos del México", pais: "México", liga: "LNBP", divisao: 1, reputacao: 3 },
  { nome: "Abejas de León", pais: "México", liga: "LNBP", divisao: 1, reputacao: 2 },

  // ==========================================
  // 🇵🇭 FILIPINAS — PBA
  // ==========================================
  { nome: "Barangay Ginebra San Miguel", pais: "Filipinas", liga: "PBA", divisao: 1, reputacao: 4 },
  { nome: "San Miguel Beermen", pais: "Filipinas", liga: "PBA", divisao: 1, reputacao: 4 },
  { nome: "TNT Tropang Giga", pais: "Filipinas", liga: "PBA", divisao: 1, reputacao: 4 },
  { nome: "Meralco Bolts", pais: "Filipinas", liga: "PBA", divisao: 1, reputacao: 3 },
  { nome: "Magnolia Hotshots", pais: "Filipinas", liga: "PBA", divisao: 1, reputacao: 3 },
  { nome: "Rain or Shine Elasto Painters", pais: "Filipinas", liga: "PBA", divisao: 1, reputacao: 3 },
];