
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- START OF TYPES (from types.ts) ---

interface WeeklyPlan {
  week: number;
  objective: string;
  content: string;
  skills: string;
  pillars: string;
}

interface SemesterCycle {
  cycle: number;
  weeks: string;
  guidingQuestion: string;
  expectedProduct: string;
  detailedWeeks: WeeklyPlan[];
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

interface SubMilestone {
  title: string;
  details: string;
  process?: string[];
}

interface Milestone {
  title: string;
  subMilestones: SubMilestone[];
}

interface ProcessStep {
    title: string;
    action: string;
    description: string;
    result: string;
}

interface MatrixDataDetail {
    category: 'Tarefas' | 'Pessoas / Funções' | 'Informações' | 'Tecnologias';
    items: string[];
}

interface MatrixQuadrant {
    title: string;
    icon: React.ComponentType;
    description: string;
    details: MatrixDataDetail[];
}

interface FlippableCardData {
  title: string;
  description: string;
}

interface CarouselCardData {
  title?: string;
  description: string;
}

interface ContentItem {
  title?: string;
  content?: string;
  points?: string[];
  flippableCards?: FlippableCardData[];
  carouselCards?: CarouselCardData[];
  category?: string;
  description?: string;
  stage?: string;
  action?: string;
}

interface SectionCardProps {
  title: string;
  subtitle: string;
  content: ContentItem[];
}

// --- END OF TYPES ---

// --- START OF CONSTANTS (from constants.tsx) ---

const StrategicVisionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ImplementationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
const PlanningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const EducatorsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21H9" /></svg>;
const MaterialsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const MarketingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.356a1.76 1.76 0 013.417-.592zM11 5.882V5.882a1.76 1.76 0 012.854.918l2.147 6.356a1.76 1.76 0 01-3.417.592l-2.147-6.356a1.76 1.76 0 01.563-1.51z" /></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const ObjectivesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ContentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const SkillsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m6-9h3m-3 6h3M3 12h3m0 0h12" /></svg>;
const PillarsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.874 5.126l7.126 4.333 7.126-4.333L12 1 4.874 5.126zM12 23V9.459" /><path d="M4.874 18.874l7.126-4.333 7.126 4.333L12 23l-7.126-4.126z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>;
const ChevronDownIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>);

const sections = {
  vision: { title: "Fundamentos e Visão Estratégica", subtitle: "Construindo competências do século XXI através da criação de jogos." },
  implementation: { title: "Guia de Implementação e Gestão", subtitle: "Do planejamento à execução, um roteiro para o sucesso." },
  planning: { title: "O Guia do Educador: Prática Pedagógica", subtitle: "Sequências didáticas, metodologias e ferramentas para a sala de aula." },
  educators: { title: "Nossos Educadores, Avaliação e Qualidade", subtitle: "Conheça quem faz a diferença e como medimos o sucesso." },
  materials: { title: "Materiais, Comunicação e Estratégia", subtitle: "Apoios para a Escola e Comunidade." },
  marketing: { title: "Estratégia, Desafios e Diferenciais", subtitle: "Entendendo o posicionamento e os pontos fortes do LAB Cria Games." },
  ai: { title: "Assistente de IA para Educadores", subtitle: "Ferramentas de IA para auxiliar os educadores." }
};

const strategicVision: ContentItem[] = [
  {
    title: "Apresentação do Produto: A Proposta de Valor",
    content: "O LAB Cria Games é uma solução educacional extracurricular desenhada para capacitar adolescentes com competências essenciais do século XXI. O propósito é desenvolver pensamento crítico, criatividade e colaboração através da criação de jogos digitais. O programa foca exclusivamente na criação de jogos 2D, onde os alunos aprendem a transformar objetos do mundo físico em elementos de um game, utilizando a ferramenta Construct 3. A proposta é oferecer uma experiência transformadora, onde a tecnologia serve como linguagem para a autoria e expressão.",
  },
  {
    title: "Estrutura do Manual",
    content: "Para máxima clareza, este manual está organizado em quatro partes lógicas, concebidas para consulta conforme as necessidades de cada profissional da escola:",
    carouselCards: [
        { title: "Parte I: Fundamentos e Visão Estratégica", description: "Detalha a filosofia, justificativa e objetivos do programa. Essencial para gestores e coordenadores." },
        { title: "Parte II: Guia de Implementação e Gestão", description: "Oferece o 'como fazer' da implementação, incluindo plano passo a passo e requisitos de infraestrutura." },
        { title: "Parte III: O Guia do Educador", description: "O coração prático do manual, focado no professor, com sequências didáticas, metodologias e ferramentas de avaliação." },
        { title: "Parte IV: Recursos e Suporte", description: "Uma rede de apoio com o guia da plataforma digital, biblioteca de recursos, glossário e contatos de suporte." },
    ]
  },
  {
    title: "Justificativa e Relevância: Resolvendo um Problema Real",
    content: "O LAB Cria Games busca preencher lacunas na educação, abordando o desinteresse dos adolescentes em atividades tradicionais e a necessidade de habilidades digitais. A proposta de valor transcende a comercialização, focando em 'honrar as juventudes' e oferecer um caminho para a autoria e autonomia. O programa alinha-se à BNCC, promovendo letramento digital e pensamento computacional de forma significativa e engajadora.",
    flippableCards: [
        { title: "Pensamento Computacional", description: "Alunos desenvolvem lógica, abstração e resolução de problemas ao projetar as mecânicas e regras de seus jogos." },
        { title: "Cultura Maker & Autoria", description: "A metodologia 'mão na massa' incentiva os alunos a criar seus próprios projetos do zero, transformando ideias em produtos digitais autorais." },
        { title: "Letramento Digital por Projeto", description: "O programa articula a rotina estruturante da LABirintar com a BNCC, focando no desenvolvimento de habilidades digitais através de projetos práticos e criativos." },
    ]
  }
];

const implementationTimeline: Milestone[] = [
  {
    title: "1. Diagnóstico e Engajamento",
    subMilestones: [
      {
        title: "Venda Consultiva e Diagnóstico",
        details: "O processo se inicia com uma venda consultiva, incluindo uma reunião inicial com a gestão para diagnosticar as necessidades da escola. Realizamos uma 'Escuta Simbólica' com a comunidade (usando o formulário 'Uma tarde que mora em mim') para gerar um Relatório Curatorial, garantindo que a solução seja relevante e alinhada.",
      },
      {
        title: "Demonstração de Valor e Comunicação",
        details: "Materiais como portfólios de experiências reais, este manual do produto e demonstrações da plataforma de gestão são utilizados para engajar a comunidade escolar. Fornecemos modelos de comunicados para apresentar o programa aos pais e alunos, garantindo clareza sobre objetivos e logística.",
      },
    ]
  },
  {
    title: "2. Onboarding e Gestão",
    subMilestones: [
       {
        title: "Matrículas e Gestão Automatizada",
        details: "A LABirintar oferece um software proprietário que automatiza todo o processo de gestão do extracurricular: matrículas online, fluxo financeiro com gateway de pagamento, check-in de presença e comunicação centralizada, reduzindo a carga operacional da escola.",
      },
      {
        title: "Alocação e Formação de Educadores",
        details: "A convocação dos Educadores Empreendedores (EEs) é ágil e baseada em dados, otimizada por um sistema de 'score de engajamento' (em desenvolvimento). Os EEs selecionados passam por uma formação contínua, com imersão na metodologia e capacitação técnica para garantir a excelência pedagógica.",
        process: [
          "Alerta de Demanda: Uma nova turma é confirmada e registrada no software.",
          "Filtragem Inteligente: O sistema filtra a rede por especialidade (ex: Jogos Digitais), geolocalização e disponibilidade.",
          'Ranking por Score: Os EEs são ranqueados pelo "Score do EE", que pondera competência, desempenho e agilidade de resposta.',
          "Disparo Automatizado: Uma notificação é enviada para os EEs mais bem ranqueados. A vaga é preenchida pelo primeiro a aceitar, garantindo velocidade.",
          "Onboarding de Pares: O líder da comunidade de EEs realiza o alinhamento com o educador alocado, garantindo a continuidade pedagógica.",
        ],
      },
       {
        title: "Infraestrutura e Lançamento do Programa",
        details: "Apoiamos a escola na preparação para o primeiro dia de aulas com um checklist final, que abrange desde a configuração dos espaços e tecnologia (computadores com Construct 3, câmeras/celulares) até a confirmação do acesso de todos à plataforma.",
       }
    ]
  },
  {
    title: "3. Execução, Suporte e Celebração",
    subMilestones: [
        {
          title: "Vivência Criativa e Integração com o PPP",
          details: "Durante 16 semanas, os alunos criam seus jogos autorais. O programa é desenhado para se integrar harmoniosamente ao Projeto Político-Pedagógico (PPP) da escola, enriquecendo a oferta curricular e desenvolvendo competências do século XXI.",
        },
        {
          title: "Suporte Contínuo",
          details: "A LABirintar oferece suporte contínuo nas áreas pedagógica, técnica e administrativa, com canais de comunicação claros e tempos de resposta definidos (SLA) para garantir uma parceria de longo prazo bem-sucedida."
        },
        {
          title: "Mostra de Criadores e Portfólio Digital",
          details: "As produções são celebradas em uma 'Mostra de Criadores'. Os projetos são exibidos para a comunidade, e os alunos recebem certificados, construindo um portfólio digital de suas criações autorais.",
        }
    ]
  }
];

const semesterPlan: SemesterCycle[] = [
  {
    cycle: 1,
    weeks: "1-4",
    guidingQuestion: "Como transformar uma ideia em um objeto criativo?",
    expectedProduct: "Protótipos físicos para assets do jogo (nave, disparos, asteroides)",
    detailedWeeks: [
      { week: 1, objective: "Introduzir o projeto e estimular a criatividade.", content: "Brainstorming, conceito de game asset, técnicas de desenho.", skills: "Criatividade, Comunicação, Planejamento.", pillars: "Intencionalidade, Aproximação" },
      { week: 2, objective: "Explorar a criação com materiais recicláveis e do cotidiano.", content: "Construção de protótipos com objetos do dia a dia.", skills: "Resolução de Problemas, Cultura Maker.", pillars: "Cooperação, Expressão Criativa" },
      { week: 3, objective: "Construir objetos com peças de Lego.", content: "Técnicas de montagem com Lego para criar personagens e cenários.", skills: "Visão Espacial, Raciocínio Lógico.", pillars: "Presença, Documentação" },
      { week: 4, objective: "Finalizar e refinar os protótipos físicos.", content: "Detalhes finais, pintura e preparação para a digitalização.", skills: "Atenção ao Detalhe, Autonomia.", pillars: "Curadoria, Autoavaliação" },
    ]
  },
  {
    cycle: 2,
    weeks: "5-8",
    guidingQuestion: "Como dar vida digital aos nossos objetos?",
    expectedProduct: "Assets digitais e cena inicial no Construct 3",
    detailedWeeks: [
      { week: 5, objective: "Aprender a capturar e tratar imagens.", content: "Técnicas de fotografia, iluminação, e edição básica de imagem.", skills: "Cultura Digital, Tecnologia Digital.", pillars: "Intencionalidade, Documentação" },
      { week: 6, objective: "Introdução ao Construct 3.", content: "Interface, sprites, objetos e layout do jogo.", skills: "Pensamento Computacional (Abstração).", pillars: "Aproximação, Expressão Criativa" },
      { week: 7, objective: "Importar e organizar os assets no jogo.", content: "Criar sprites a partir das imagens, organizar a biblioteca de assets.", skills: "Organização, Tecnologia Digital.", pillars: "Presença, Cooperação" },
      { week: 8, objective: "Montar a primeira cena do jogo.", content: "Posicionar os sprites, definir o background e a câmera.", skills: "Design de Nível (Básico), Autonomia.", pillars: "Curadoria, Autoavaliação" },
    ]
  },
  {
    cycle: 3,
    weeks: "9-12",
    guidingQuestion: "Como criar as regras do nosso universo?",
    expectedProduct: "Jogo com mecânicas básicas (movimento, disparo, colisão)",
    detailedWeeks: [
      { week: 9, objective: "Programar o movimento do jogador.", content: "Eventos e ações no Construct 3, comportamentos (behaviors).", skills: "Pensamento Computacional (Algoritmos).", pillars: "Intencionalidade, Ação Transformadora" },
      { week: 10, objective: "Implementar a mecânica de disparo.", content: "Criar e destruir objetos, lógica de projéteis.", skills: "Raciocínio Lógico, Resolução de Problemas.", pillars: "Aproximação, Cooperação" },
      { week: 11, objective: "Criar inimigos e colisões.", content: "Movimento de inimigos, detecção de colisão e consequências (pontos, vida).", skills: "Pensamento Computacional (Decomposição).", pillars: "Presença, Expressão Criativa" },
      { week: 12, objective: "Adicionar interface de usuário (UI) básica.", content: "Exibir pontuação e vida na tela.", skills: "Design de Interface, Tecnologia Digital.", pillars: "Documentação, Curadoria" },
    ]
  },
  {
    cycle: 4,
    weeks: "13-16",
    guidingQuestion: "Como compartilhar nossa criação com o mundo?",
    expectedProduct: "Versão final do jogo e apresentação",
    detailedWeeks: [
      { week: 13, objective: "Polimento e adição de som.", content: "Efeitos sonoros e música de fundo (bancos gratuitos).", skills: "Curadoria de Mídia, Atenção ao Detalhe.", pillars: "Autoavaliação, Expressão Criativa" },
      { week: 14, objective: "Playtesting e feedback.", content: "Jogar os games dos colegas e fornecer feedback construtivo.", skills: "Comunicação, Pensamento Crítico.", pillars: "Cooperação, Ação Transformadora" },
      { week: 15, objective: "Preparar a apresentação do jogo.", content: "Criar um pequeno roteiro para apresentar o projeto.", skills: "Comunicação, Protagonismo.", pillars: "Autonomia, Curadoria" },
      { week: 16, objective: "Mostra de Criadores: Apresentação dos jogos.", content: "Evento final de apresentação dos projetos para colegas, pais e educadores.", skills: "Autoconfiança, Celebração.", pillars: "Presença, Contemplação" },
    ]
  },
];

const planningFinalConsiderations = "Este guia é um ponto de partida. Cada educador é incentivado a adaptar as propostas conforme o grupo, o território e os desejos criativos emergentes. A rotina estruturante da LABirintar é uma bússola para o encantamento, a autoria e a autonomia pedagógica.";

const educators: ContentItem[] = [
  {
    title: "Nossos Educadores: A Força da Rede",
    content: "O sucesso do LAB Cria Games reside na qualidade e paixão de nossos educadores empreendedores. Para as turmas iniciais, contamos com dois especialistas:",
    carouselCards: [
      {
        title: "Marcos Moraes: O Arquiteto do Jogo",
        description: "Um 'programador de jogos na veia', Marcos é apaixonado pelo que faz e possui profundo conhecimento técnico. Ele engaja os alunos desde a primeira aula e está ativamente envolvido no desenvolvimento da plataforma tecnológica da LABirintar, incorporando o perfil do educador inovador que buscamos."
      },
      {
        title: "Everton: O Construtor de Mundos",
        description: "Educador qualificado da rede LABirintar, Everton foi selecionado por sua experiência e alinhamento com nossa metodologia. Ele complementa a equipe, trazendo sua paixão por ensinar e guiar os alunos em suas jornadas de criação de jogos."
      },
      {
        title: "Gustavo (8Bits): O Mestre Conceitual",
        description: "A concepção do produto foi refinada em parceria com Gustavo, da 8Bits, que fornece materiais de apoio e slides de aula de alta qualidade, garantindo uma base sólida para a prática pedagógica dos educadores."
      },
    ]
  },
  {
    title: "Avaliação e Qualidade",
    content: "Nossa abordagem de avaliação é contínua e integrada à plataforma, focando no desenvolvimento de competências.",
    flippableCards: [
        {
          title: "Plataforma Orientada a Dados",
          description: "Nossa plataforma proprietária captura dados sobre o desenvolvimento de competências dos alunos de forma não intrusiva, transformando interações em insights valiosos para a escola."
        },
        {
          title: "IA para Métricas de Engajamento",
          description: "A inteligência artificial integrada consegue metrificar o engajamento de crianças, educadores e famílias, ajudando a escola a entender e adequar sua oferta educacional."
        },
        {
          title: "Relatórios e Insights",
          description: "Geramos relatórios analíticos sobre o perfil e as preferências dos alunos, apoiando a tomada de decisão pedagógica e estratégica da escola."
        },
        {
          title: "Formação Contínua",
          description: "A LABirintar promove formação pedagógica completa e encontros semanais com os educadores para apresentar, discutir e aprimorar o material, garantindo a excelência na entrega."
        },
    ]
  }
];

const materials: ContentItem[] = [
    { category: "Guia da Família", description: "Explica o projeto, com sugestões para apoio em casa." },
    { category: "Listas Curadas", description: "Jogos, vídeos, livros e filmes relacionados ao conteúdo." },
    { category: "Desafios e Competições", description: "Indicações de olimpíadas, hackathons e eventos culturais." },
    { category: "Glossário de Termos", description: "Vocabulário acessível (rubrica, gamificação, BNCC, etc.)" },
    { category: "Aspectos Legais e Regulatórios", description: "Alinhamento com LGPD, PNE, uso responsável de tecnologia." },
    { category: "Recursos Técnicos e Parceiros", description: "Parcerias com festivais, projetos, estúdios e provedores." },
];

const strategyAndDifferentials: ContentItem[] = [
    {
      title: "Desafios e Estratégias",
      points: [
          "Engajamento de Adolescentes: Superar a apatia com um nome atrativo, liberdade criativa e uma proposta 'mão na massa' que conecta o mundo físico e digital.",
          "Validação do Produto: Apresentar o 'manual do produto' detalhado, com cronograma e exemplos, para dar solidez e confiança à proposta customizada.",
          "Divulgação Eficaz: Desenvolver campanhas de marketing direcionadas dentro da escola para gerar interesse e matrículas, com possibilidade de oficinas gratuitas.",
          "Preço e Viabilidade: Oferecer um preço competitivo (R$190/mês para 1h/semana) para aumentar o valor percebido, com metas claras de matrículas para garantir a viabilidade.",
      ]
    },
    {
      title: "Diferenciais da LABirintar",
      points: [
          "Ecossistema de Educadores Empreendedores: Uma rede de profissionais apaixonados e com conhecimento prático, garantindo aulas engajadoras e de alta qualidade.",
          "Tecnologia e Gestão Automatizada: Um software proprietário que simplifica a vida da escola, automatizando matrículas, pagamentos e comunicação.",
          "Foco em Educação Integral: Posicionamos o extracurricular como parte da educação integral, gerando dados que comprovam o desenvolvimento socioemocional e cognitivo.",
          "Agilidade e Inovação: Desenvolvimento ágil em low-code que permite entregar novas funcionalidades e responder rapidamente às necessidades das escolas."
      ]
    },
    {
      title: "Ações de Marketing e Engajamento para Matrículas",
      content: "A seguir, uma série de sugestões de ações para serem avaliadas e implementadas na campanha de conversão de matrículas, aproveitando o retorno das férias e o engajamento natural dos alunos.",
      carouselCards: [
        {
            title: "A. Ação “Objetos com Vida”: Exposição Interativa",
            description: "Objetivo: Encantar alunos mostrando que objetos comuns podem virar personagens de game. Como fazer: Montar uma bancada no pátio com objetos (pilhas, clips) ao lado de suas versões digitais em um jogo, com placas provocadoras."
        },
        {
            title: "B. Estúdio de Captura: “Vem Criar o Seu Personagem!”",
            description: "Objetivo: Permitir que os alunos vivenciem o processo de criação. Como fazer: Criar um mini estúdio com fundo neutro onde os alunos podem fotografar objetos da mochila para transformá-los em sprites de jogo na hora."
        },
        {
            title: "C. “Rádio da Escola” com Voz dos Alunos",
            description: "Objetivo: Gerar burburinho lúdico e protagonismo. Como fazer: Veicular no sistema de som da escola áudios curtos de alunos respondendo à pergunta 'Se seu estojo fosse uma nave no game, como ele seria?'."
        },
        {
            title: "D. Desafio “Objetaço”: Concurso de Ideias",
            description: "Objetivo: Criar competição saudável e sentimento de pertencimento. Como fazer: Lançar um desafio de 24h para os alunos enviarem fotos de objetos e suas ideias de transformação em game. As melhores são exibidas na escola."
        },
        {
            title: "E. Ação com Educadores: “Gamear o Cotidiano”",
            description: "Objetivo: Envolver toda a comunidade escolar. Como fazer: Convidar professores de outras disciplinas a 'gamear' um objeto da sua sala de aula (ex: um livro de história vira uma máquina do tempo), espalhando o espírito do projeto."
        },
        {
            title: "F. Cartazes Provocadores e Slogans",
            description: "Objetivo: Manter o projeto visível e gerar curiosidade. Como fazer: Espalhar cartazes com frases como 'Sua criatividade pediu um joystick. Atenda.' e QR Codes. Slogan: 'LAB Cria Games: O game começa fora da tela.'."
        },
        {
            title: "G. Teaser em Vídeo",
            description: "Objetivo: Gerar impacto rápido e viralização. Como fazer: Produzir um vídeo curto e dinâmico com o lema 'Desenhe. Recorte. Fotografe. Jogue.' para circular nos grupos de WhatsApp e nas TVs da escola."
        }
      ]
    }
];

const AI_SYSTEM_INSTRUCTION = `You are a world-class pedagogical assistant for the 'LAB Cria Games' program.
This program, developed by LABirintar in partnership with 8Bits, is an extracurricular course for middle school students (Ensino Fundamental 2) in Brazil. It focuses exclusively on creating 2D digital games using the Construct 3 platform.
The core pedagogical concept is to transform physical objects (created via drawing, Lego, or everyday items) into digital assets for a game.

Your primary role is to assist educators by providing creative and practical resources that align with the program's core principles.

Core Principles to follow:
1.  **Product Focus:** The product is "LAB Cria Games". There is no audiovisual component.
2.  **Tools:** The primary tool is Construct 3 (free version). Students will also use cameras/phones to capture images of physical objects.
3.  **Methodology:** Emphasize Project-Based Learning and Maker Culture. Students learn by doing, with a focus on authoring their own games. Creation is mostly individual.
4.  **Alignment with BNCC:** All content must be aligned with Brazil's Base Nacional Comum Curricular (BNCC), particularly focusing on digital literacy and computational thinking.
5.  **Engaging Content:** Create materials that are relevant and exciting for teenagers, giving them creative freedom.
6.  **Structure:** The program is a one-semester course with weekly 1-hour sessions. The content is structured to guide students from physical creation to a finished 2D game.

Your tasks include:
- Generating detailed lesson plans for the 16-week semester.
- Creating engaging activities, challenges, and "ice-breakers".
- Developing assessment rubrics for the games created.
- Drafting communication models for parents and the school community.
- Suggesting physical materials (Lego, art supplies) for activities.

Key People:
- Gustavo (8Bits): The main concept designer of the course.
- Marcos and Everton (LABirintar): The lead educators for the initial classes. Marcos is deeply involved in LABirintar's tech platform.

Always respond in Portuguese (Brazil). Be encouraging, clear, and inspiring in your tone.`;

// --- END OF CONSTANTS ---

// --- START OF SERVICES (from geminiService.ts) ---

const getAIAssistance = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Desculpe, o assistente de IA não está configurado. A chave da API (API_KEY) do Google precisa ser definida no ambiente.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: AI_SYSTEM_INSTRUCTION,
        },
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return 'Ocorreu um erro: A chave da API fornecida não é válida. Por favor, verifique a configuração.';
        }
        return `Ocorreu um erro ao contatar o assistente de IA: ${error.message}`;
    }
    return "Ocorreu um erro desconhecido ao contatar o assistente de IA.";
  }
};

// --- END OF SERVICES ---

// --- START OF COMPONENTS ---

// From components/SectionCard.tsx
const Carousel: React.FC<{ items: CarouselCardData[] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-1">
              <div className="bg-accent-lavender/30 rounded-lg flex flex-col px-6 pt-6 pb-12 text-center">
                {item.title && <h4 className="font-bold text-dark-text text-lg mb-3">{item.title}</h4>}
                <p className="text-dark-text/90 leading-relaxed text-base">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 shadow-md -ml-2 sm:-ml-4 z-10"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 shadow-md -mr-2 sm:-mr-4 z-10"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? 'bg-primary' : 'bg-primary/30'}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

const FlippableCard: React.FC<FlippableCardData> = ({ title, description }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div
      className={`flip-card w-full h-64 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyPress={(e) => e.key === 'Enter' && setIsFlipped(!isFlipped)}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front bg-accent-blue/40 text-center">
          <h4 className="text-lg font-bold text-dark-text">{title}</h4>
        </div>
        <div className="flip-card-back bg-accent-blue/80 text-center overflow-y-auto">
          <p className="text-white text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const SectionCard: React.FC<SectionCardProps> = ({ title, subtitle, content }) => {
  return (
    <div className="bg-white/70 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm border border-primary/10 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-raleway font-bold text-primary">{title}</h2>
        <p className="text-dark-text/80 mt-2 font-raleway font-medium">{subtitle}</p>
      </div>
      <div className="space-y-8">
        {content.map((item, index) => (
          <div key={index}>
            {item.title && <h3 className="text-xl font-raleway font-semibold text-secondary mb-4">{item.title}</h3>}
            {item.content && <p className="text-dark-text/90 leading-relaxed mb-4">{item.content}</p>}

            {item.carouselCards && <Carousel items={item.carouselCards} />}

            {item.points && (
              <ul className="space-y-3 mt-4">
                {item.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start text-dark-text/90 leading-relaxed">
                     <svg className="w-5 h-5 text-secondary mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {item.flippableCards && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {item.flippableCards.map((card, cardIndex) => (
                  <FlippableCard key={cardIndex} title={card.title} description={card.description} />
                ))}
              </div>
            )}

            {item.category && item.description && (
              <div className="bg-accent-blue/20 p-4 rounded-lg">
                <p className="font-semibold text-secondary">{item.category}</p>
                <p className="text-dark-text/90">{item.description}</p>
              </div>
            )}
            {item.stage && item.action && (
              <div className="bg-accent-blue/20 p-4 rounded-lg flex flex-col sm:flex-row">
                <p className="font-bold text-secondary w-full sm:w-1/4">{item.stage}</p>
                <p className="text-dark-text/90 w-full sm:w-3/4 mt-1 sm:mt-0">{item.action}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// From components/SemesterPlan.tsx
const SemesterPlan: React.FC = () => {
  const [openCycle, setOpenCycle] = useState<number | null>(1);

  const toggleCycle = (cycle: number) => {
    setOpenCycle(prev => (prev === cycle ? null : cycle));
  };

  return (
    <div className="bg-white/70 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm border border-primary/10 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-raleway font-bold text-primary">{sections.planning.title}</h2>
        <p className="text-dark-text/80 mt-2 font-raleway font-medium">{sections.planning.subtitle}</p>
      </div>
      <div className="space-y-4">
        {semesterPlan.map((cycleData) => {
            const isOpen = openCycle === cycleData.cycle;
            return (
              <div key={cycleData.cycle} className="bg-white/60 rounded-lg border border-accent-lavender/40 overflow-hidden shadow-sm transition-all duration-300">
                 <button
                    className="w-full flex justify-between items-center text-left p-4 sm:p-6 hover:bg-accent-lavender/20 transition-colors"
                    onClick={() => toggleCycle(cycleData.cycle)}
                    aria-expanded={isOpen}
                 >
                    <div className="flex-grow">
                        <div className="flex items-center gap-4">
                             <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold text-lg">
                                {cycleData.cycle}
                            </div>
                            <div>
                               <p className="font-semibold text-secondary text-lg font-raleway">Ciclo {cycleData.cycle}: {cycleData.guidingQuestion}</p>
                               <p className="text-sm text-dark-text/70">Semanas {cycleData.weeks} | Produto: {cycleData.expectedProduct}</p>
                            </div>
                        </div>
                    </div>
                     <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon />
                     </span>
                 </button>

                 <div
                    className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                 >
                    <div className="overflow-hidden">
                        <div className="p-4 sm:p-6 border-t border-accent-lavender/40 space-y-6">
                            {cycleData.detailedWeeks.map(week => (
                               <div key={week.week} className="border-l-4 border-accent-blue/50 pl-4 py-2">
                                  <h4 className="font-bold text-dark-text mb-3">Semana {week.week}</h4>
                                  <div className="space-y-3 text-sm text-dark-text/90">
                                      <div className="flex items-start gap-3">
                                          <span className="text-secondary mt-0.5 flex-shrink-0"><ObjectivesIcon /></span>
                                          <p><span className="font-semibold text-dark-text">Objetivos:</span> {week.objective}</p>
                                      </div>
                                      <div className="flex items-start gap-3">
                                          <span className="text-secondary mt-0.5 flex-shrink-0"><ContentIcon /></span>
                                          <p><span className="font-semibold text-dark-text">Conteúdos:</span> {week.content}</p>
                                      </div>
                                      <div className="flex items-start gap-3">
                                          <span className="text-secondary mt-0.5 flex-shrink-0"><SkillsIcon /></span>
                                          <p><span className="font-semibold text-dark-text">Habilidades:</span> {week.skills}</p>
                                      </div>
                                      <div className="flex items-start gap-3">
                                          <span className="text-secondary mt-0.5 flex-shrink-0"><PillarsIcon /></span>
                                          <p><span className="font-semibold text-dark-text">Pilares LABirintar:</span> {week.pillars}</p>
                                      </div>
                                  </div>
                               </div>
                            ))}
                        </div>
                    </div>
                 </div>
              </div>
            )
        })}
      </div>
       <div className="mt-8 pt-6 border-t border-primary/10">
            <h3 className="text-xl font-raleway font-semibold text-secondary mb-3">Considerações Finais</h3>
            <p className="text-dark-text/80 leading-relaxed italic">{planningFinalConsiderations}</p>
        </div>
    </div>
  );
};

// From components/AIAssistant.tsx
const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Olá! Sou seu assistente pedagógico para o LAB Cria Games. Como posso ajudar a planejar suas aulas com Construct 3, criar atividades ou desenvolver rubricas hoje?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getAIAssistance(input);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'model',
        text: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionPrompts = [
      "Crie um plano de aula para a semana 9 sobre movimento do jogador",
      "Sugira uma atividade 'quebra-gelo' usando objetos do cotidiano",
      "Elabore uma rubrica para avaliar um jogo 2D feito no Construct 3",
      "Escreva um e-mail para os pais sobre a Mostra de Criadores no final do semestre"
  ]

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
  }

  return (
    <div className="bg-white/70 rounded-xl shadow-lg flex flex-col h-[calc(100vh-5rem)] max-h-[800px] backdrop-blur-sm border border-primary/10 animate-fade-in">
        <div className="p-4 sm:p-6 border-b border-primary/10">
            <h2 className="text-3xl font-raleway font-bold text-primary flex items-center gap-3">
                <AIIcon />
                <span>{sections.ai.title}</span>
            </h2>
            <p className="text-dark-text/80 mt-2 font-raleway font-medium">{sections.ai.subtitle}</p>
        </div>

      <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                  <AIIcon />
                </div>
              )}
              <div
                className={`max-w-xl p-4 rounded-xl whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-accent-blue/30 text-dark-text rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                  <AIIcon />
                </div>
              <div className="bg-accent-blue/30 p-4 rounded-xl rounded-bl-none">
                <div className="flex items-center gap-2 text-dark-text/70">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
       {messages.length <= 1 && (
        <div className="p-4 sm:p-6 pt-0">
            <p className="text-dark-text/70 mb-3 text-sm">Sugestões:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestionPrompts.map(prompt => (
                    <button key={prompt} onClick={() => handleSuggestionClick(prompt)} className="text-left text-sm bg-accent-lavender/40 hover:bg-accent-lavender/60 text-dark-text/80 p-3 rounded-lg transition-colors duration-200">
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
        )}

      <div className="p-4 sm:p-6 border-t border-primary/10">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-grow bg-white/80 border border-accent-blue/60 text-dark-text rounded-lg p-3 focus:ring-2 focus:ring-secondary focus:outline-none transition-all"
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-secondary hover:bg-orange-500 disabled:bg-dark-text/20 disabled:cursor-not-allowed text-white font-bold py-3 px-5 rounded-lg transition-all duration-200"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

// From components/ImplementationTimeline.tsx
const ImplementationTimeline: React.FC = () => {
    const [openSubMilestone, setOpenSubMilestone] = useState<string | null>(null);

    const toggleSubMilestone = (title: string) => {
        setOpenSubMilestone(prev => (prev === title ? null : title));
    };

    return (
        <div className="bg-white/70 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm border border-primary/10 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-raleway font-bold text-primary">{sections.implementation.title}</h2>
                <p className="text-dark-text/80 mt-2 font-raleway font-medium">{sections.implementation.subtitle}</p>
            </div>

            <div className="relative">
                <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-0.5 bg-accent-lavender/60" aria-hidden="true"></div>

                <div className="space-y-12">
                    {implementationTimeline.map((milestone, milestoneIndex) => (
                        <div key={milestoneIndex} className="pl-12 relative">
                            <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-bold text-lg shadow-md">
                                {milestoneIndex + 1}
                            </div>
                            <h3 className="text-2xl font-raleway font-semibold text-secondary mb-6">{milestone.title}</h3>

                            <div className="space-y-4">
                                {milestone.subMilestones.map((sub, subIndex) => {
                                    const isOpen = openSubMilestone === sub.title;
                                    return (
                                        <div key={subIndex} className="bg-white/60 rounded-lg border border-accent-blue/30 overflow-hidden shadow-sm">
                                            <button
                                                className="w-full flex justify-between items-center text-left p-4 hover:bg-accent-lavender/20 transition-colors"
                                                onClick={() => toggleSubMilestone(sub.title)}
                                                aria-expanded={isOpen}
                                            >
                                                <span className="font-semibold text-dark-text">{sub.title}</span>
                                                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                  <ChevronDownIcon />
                                                </span>
                                            </button>
                                            <div
                                                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="p-4 pt-0 text-dark-text/90 leading-relaxed">
                                                        <p>{sub.details}</p>
                                                        {sub.process && (
                                                            <div className="mt-4 border-t border-accent-lavender pt-4">
                                                                <ol className="space-y-3">
                                                                    {sub.process.map((step, stepIndex) => (
                                                                        <li key={stepIndex} className="flex items-start gap-3">
                                                                            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-sm mt-0.5">
                                                                                {stepIndex + 1}
                                                                            </div>
                                                                            <p className="flex-1">{step}</p>
                                                                        </li>
                                                                    ))}
                                                                </ol>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- END OF COMPONENTS ---


// --- START OF APP (from App.tsx) ---

type SectionKey = 'vision' | 'implementation' | 'planning' | 'educators' | 'materials' | 'marketing' | 'ai';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>('vision');

  const navItems = [
    { key: 'vision', icon: <StrategicVisionIcon />, text: 'Visão Estratégica' },
    { key: 'implementation', icon: <ImplementationIcon />, text: 'Implementação' },
    { key: 'planning', icon: <PlanningIcon />, text: 'Guia do Educador' },
    { key: 'educators', icon: <EducatorsIcon />, text: 'Educadores' },
    { key: 'materials', icon: <MaterialsIcon />, text: 'Materiais' },
    { key: 'marketing', icon: <MarketingIcon />, text: 'Estratégia' },
    { key: 'ai', icon: <AIIcon />, text: 'Assistente IA' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'vision':
        return <SectionCard title={sections.vision.title} subtitle={sections.vision.subtitle} content={strategicVision as ContentItem[]} />;
      case 'implementation':
        return <ImplementationTimeline />;
      case 'planning':
        return <SemesterPlan />;
      case 'educators':
        return <SectionCard title={sections.educators.title} subtitle={sections.educators.subtitle} content={educators as ContentItem[]} />;
      case 'materials':
        return <SectionCard title={sections.materials.title} subtitle={sections.materials.subtitle} content={materials as ContentItem[]} />;
      case 'marketing':
        return <SectionCard title={sections.marketing.title} subtitle={sections.marketing.subtitle} content={strategyAndDifferentials as ContentItem[]} />;
      case 'ai':
        return <AIAssistant />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light-bg text-dark-text font-sans flex flex-col lg:flex-row">
      <aside className="w-full lg:w-72 bg-white/30 backdrop-blur-sm lg:h-screen lg:fixed p-4 border-b lg:border-r border-primary/10">
        <div className="text-center mb-8 px-2">
            <h1 className="text-2xl font-raleway font-bold text-primary">LAB Cria Games</h1>
            <p className="text-sm text-dark-text/80 font-raleway -mt-1 leading-tight">8Bits Game Adventure</p>
            <p className="text-xs text-secondary font-semibold mt-3 tracking-wider">MANUAL DO PRODUTO</p>
        </div>
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.key} className="mb-2">
                <button
                  onClick={() => setActiveSection(item.key as SectionKey)}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 ${
                    activeSection === item.key
                      ? 'bg-primary text-white shadow-md'
                      : 'hover:bg-primary/20 text-dark-text/70 hover:text-dark-text'
                  }`}
                >
                  <span className={`mr-3 ${activeSection === item.key ? 'text-white' : 'text-primary'}`}>{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
         <div className="absolute bottom-6 left-4 right-4 text-center hidden lg:block">
            <img src="https://raw.githubusercontent.com/clubesa/clubesa.github.io/main/producao/festivalLabCria/logoslabirintar/Labirintar_RGB.png" alt="LABirintar Logo" className="h-6 mx-auto opacity-70" />
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 p-4 sm:p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

// --- END OF APP ---

// --- RENDER LOGIC ---

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
    console.error("Target container 'root' not found in the DOM.");
}
