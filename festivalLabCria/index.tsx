import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';


async function askGemini(prompt: string) {
  try {
    const response = await fetch('https://assistente-vmv2jjnpua-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`Erro da API: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Erro ao chamar o assistente:", error);
    return "Desculpe, ocorreu um erro ao tentar gerar a resposta.";
  }
}

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
const ObjectivesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ContentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const SkillsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m6-9h3m-3 6h3M3 12h3m0 0h12" /></svg>;
const PillarsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.874 5.126l7.126 4.333 7.126-4.333L12 1 4.874 5.126zM12 23V9.459" /><path d="M4.874 18.874l7.126-4.333 7.126 4.333L12 23l-7.126-4.126z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>;
const InboundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.5a4.5 4.5 0 11-6.364-6.364M16.5 12a4.5 4.5 0 11-6.364 6.364L16.5 12z" /></svg>;
const OutboundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>;
const TaskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const PeopleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TechIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>;
const ChevronDownIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>);

const sections = {
  vision: { title: "Visão Estratégica e Proposta de Valor", subtitle: "Entendendo o propósito e o valor do programa." },
  implementation: { title: "Implementação e Funcionamento", subtitle: "Etapas de execução." },
  planning: { title: "Planejamento Pedagógico Semestral", subtitle: "Uma jornada interativa de 16 semanas de criação e descoberta." },
  educators: { title: "Educadores, Avaliação e Qualidade", subtitle: "A excelência na entrega é garantida por um programa de formação contínua." },
  materials: { title: "Materiais, Comunicação e Estratégia", subtitle: "Apoios para a Escola e Comunidade." },
  pricing: { title: "Precificação", subtitle: "Valor mensal e estrutura de atendimento do programa." },
  marketing: { title: "Processo Operacional", subtitle: "Sugestão de processo operacional com base em desenvolvimento ágil de clientes." },
  ai: { title: "Assistente de IA para Educadores", subtitle: "Ferramentas de IA para auxiliar os educadores." }
};

const strategicVision: ContentItem[] = [
  {
    title: "O que é o Festival LAB Cria?",
    content: "O Festival LAB Cria é um programa extracurricular autoral, desenvolvido pela LABirintar, voltado a adolescentes do Ensino Fundamental II e Ensino Médio. Ele combina a rotina estruturante da LABirintar, os princípios da BNCC e da BNCC Computacional, além de laboratórios criativos. O foco é articular tecnologia, presença e criação significativa com as linguagens dos jogos digitais e da expressão audiovisual, desenvolvendo competências essenciais para o século XXI.",
  },
  {
    title: "Por que sua escola deve oferecer esse programa?",
    carouselCards: [
        { description: "Integra as atividades extracurriculares ao currículo formal com propósito pedagógico e base legal sólida (BNCC + BNCC Computacional)." },
        { description: "Resolve o desengajamento dos adolescentes com linguagem, temas e formatos que fazem sentido para eles." },
        { description: "Oferece uma solução completa: educadores formados, metodologia estruturada, software de gestão e indicadores de impacto." },
        { description: "Gera resultados pedagógicos visíveis e conteúdos comunicáveis para as famílias, fortalecendo a imagem da escola." },
        { description: "Libera a gestão escolar da sobrecarga operacional e garante segurança jurídica e excelência na entrega." },
    ]
  },
  {
    title: "Nossa Visão Pedagógica",
    content: "O LAB Cria parte do princípio de que a tecnologia deve estar a serviço da infância e da adolescência como linguagem criativa, não como ferramenta neutra. Vemos a infância/juventude como potência criadora, e não apenas consumidora de conteúdos. Propomos uma educação viva, onde adolescentes constroem projetos digitais com autonomia, ética e imaginação. A metodologia se inspira em práticas como Aprendizagem Baseada em Projetos, Cultura Maker e experiências autorais com ferramentas de IA e design digital.",
  },
  {
    title: "Alinhamento com o Projeto Político-Pedagógico (PPP) e a BNCC",
    content: "O programa dialoga diretamente com as Competências Gerais da Educação Básica da BNCC e com os eixos da BNCC Computacional. Clique nos cards abaixo para saber mais:",
    flippableCards: [
        { title: "Pensamento Computacional", description: "Os alunos desenvolvem raciocínio lógico, abstração e decomposição de problemas ao planejar as regras de um jogo ou a estrutura de uma narrativa audiovisual." },
        { title: "Cultura Digital", description: "O programa promove a fluência digital, permitindo que os alunos não apenas consumam, mas produzam e remixem cultura de forma crítica, ética e criativa." },
        { title: "Tecnologia Digital", description: "Os alunos utilizam ferramentas de software para edição de vídeo e criação de jogos, aplicando a tecnologia para materializar suas ideias e projetos." },
    ]
  }
];

const implementationTimeline: Milestone[] = [
  {
    title: "1. Diagnóstico e Planejamento",
    subMilestones: [
      {
        title: "Reunião Inicial",
        details: "Reunião inicial com a gestão pedagógica para alinhamento e integração ao Projeto Pedagógico da Escola.",
      },
      {
        title: "Escuta Simbólica",
        details: "Aplicação do formulário poético “Uma tarde que mora em mim” com famílias e estudantes para escuta simbólica.",
      },
      {
        title: "Relatório Curatorial",
        details: "Geração de um relatório curatorial que orienta a Escola e aproxima o programa da realidade local.",
      },
    ]
  },
  {
    title: "2. Formação e Execução",
    subMilestones: [
       {
        title: "Formação Continuada da Equipe",
        details: "Realizaremos um programa robusto de formação inicial, apresentando a filosofia da LABirintar, as metodologias do LAB Cria, as sequências didáticas, as ferramentas de avaliação e a plataforma digital. Este será um processo contínuo de desenvolvimento profissional.",
      },
      {
        title: "Comunicação com a Comunidade Escolar",
        details: "Forneceremos modelos de comunicados (e-mail, redes sociais, reuniões) para apresentar o programa aos pais e alunos, garantindo uma comunicação clara sobre benefícios, objetivos e logística.",
      },
      {
        title: "Lançamento do Programa",
        details: "Apoiaremos a escola na preparação para o primeiro dia de aulas, com um checklist final que abrange desde a configuração dos espaços e tecnologia até a confirmação do acesso de todos os usuários à plataforma.",
      },
      {
        title: "Convocação Ágil de Educadores Empreendedores (EEs)",
        details: "Para atender à imprevisibilidade das demandas escolares, o processo de convocação dos EEs é ágil e baseado em dados:",
        process: [
          "Alerta de Demanda: Uma nova turma é confirmada ou uma substituição é necessária. A demanda é registrada no software LABirintar.",
          "Filtragem Inteligente: O sistema filtra a rede de EEs por especialidade (Jogos/Audiovisual), geolocalização e disponibilidade.",
          'Ranking por Score: Os EEs filtrados são ranqueados pelo "Score do EE" que pondera competência, desempenho em aulas anteriores e, crucialmente, agilidade de resposta a convocações passadas.',
          "Disparo Automatizado: Uma notificação é enviada via app/WhatsApp para os EEs mais bem ranqueados. A vaga é preenchida pelo primeiro a aceitar, garantindo velocidade.",
          "Onboarding de Pares: O Líder da Comunidade de EEs é notificado e realiza uma rápida sessão de alinhamento com o educador alocado, garantindo a continuidade pedagógica.",
        ],
      },
      {
        title: "Incentivo à Transdisciplinaridade Criativa",
        details: "O LAB Cria promove a fusão entre audiovisual e jogos digitais. Inspirado no Festival do Minuto, o projeto semestral desafia os alunos a criarem um Game Design Document (GDD) e um 'cinematic trailer' de um minuto. Eles aprendem sobre narrativa, design, mecânicas de jogo, roteiro, storyboard, filmagem, edição e design de som.",
      },
       {
        title: "Gestão Automatizada",
        details: "Gestão automatizada via software: matrícula, check-in de presença, pagamentos e comunicação com educadores.",
       }
    ]
  },
  {
    title: "3. Vivência e Criação (16 semanas)",
    subMilestones: [
        {
          title: "Criação Autoral do Aluno",
          details: "Cada aluno cria um jogo autoral e um trailer cinematográfico de 1 minuto.",
        },
        {
          title: "Festival LAB Cria e Portfólio Digital",
          details: "As produções são exibidas no Festival LAB Cria com votação popular, premiação, certificados e portfólio digital para os alunos.",
        }
    ]
  }
];

const semesterPlan: SemesterCycle[] = [
  {
    cycle: 1,
    weeks: "1-4",
    guidingQuestion: "Quem eu sou quando crio?",
    expectedProduct: "Jogo digital com enredo pessoal",
    detailedWeeks: [
      { week: 1, objective: "Desenvolver identidade digital, narrativa pessoal, memória afetiva.", content: "Identidade digital, narrativa pessoal, memória afetiva.", skills: "EF05LP21, PC1 (decomposição), EF15EF02", pillars: "Intencionalidade, Aproximação, Cooperação" },
      { week: 2, objective: "Desenvolver fluxogramas, algoritmos simples, narrativa interativa.", content: "Fluxogramas, algoritmos simples, narrativa interativa.", skills: "PC1 (sequência, causa e efeito), EF69LP49", pillars: "Intencionalidade, Aproximação, Cooperação" },
      { week: 3, objective: "Desenvolver prototipagem, depuração, colaboração em projeto digital.", content: "Prototipagem, depuração, colaboração em projeto digital.", skills: "PC3 (testes), EF69LP50, EF04CI03", pillars: "Intencionalidade, Aproximação, Cooperação" },
      { week: 4, objective: "Desenvolver autorretrato, avaliação de processo criativo.", content: "Autorretrato, avaliação de processo criativo.", skills: "EF15AR15, EF69LP52, Competência 4 BNCC", pillars: "Intencionalidade, Aproximação, Cooperação" },
    ]
  },
  {
    cycle: 2,
    weeks: "5-8",
    guidingQuestion: "Quem sou eu no mundo?",
    expectedProduct: "Vídeo sobre identidade e pertencimento",
    detailedWeeks: [
      { week: 5, objective: "Desenvolver leitura crítica de mídias, identidade e pertencimento.", content: "Leitura crítica de mídias, identidade e pertencimento.", skills: "EF69LP53, EF69AR27, Competência 5 BNCC", pillars: "Presença, Documentação, Expressão criativa" },
      { week: 6, objective: "Desenvolver linguagem audiovisual, roteiro, storyboard.", content: "Linguagem audiovisual, roteiro, storyboard.", skills: "EF67AR27, PC2 (representação de dados)", pillars: "Presença, Documentação, Expressão criativa" },
      { week: 7, objective: "Desenvolver produção audiovisual, ética digital, direitos autorais.", content: "Produção audiovisual, ética digital, direitos autorais.", skills: "EF69LP51, EF09LP25, Competência 8 BNCC", pillars: "Presença, Documentação, Expressão criativa" },
      { week: 8, objective: "Desenvolver curadoria, autoavaliação, expressão artística.", content: "Curadoria, autoavaliação, expressão artística.", skills: "EF67AR28, EF69LP52, Competência 10 BNCC", pillars: "Presença, Documentação, Expressão criativa" },
    ]
  },
  {
    cycle: 3,
    weeks: "9-12",
    guidingQuestion: "O que quero transformar?",
    expectedProduct: "Jogo com causa social",
    detailedWeeks: [
      { week: 9, objective: "Desenvolver causas sociais, empatia, cidadania digital.", content: "Causas sociais, empatia, cidadania digital.", skills: "EF07HI07, PC4 (impacto social), EF09EF10", pillars: "Autonomia, Cooperação, Ação transformadora" },
      { week: 10, objective: "Desenvolver design de jogos, narrativa de transformação.", content: "Design de jogos, narrativa de transformação.", skills: "EF08LP24, PC2 (algoritmos), Competência 6 BNCC", pillars: "Autonomia, Cooperação, Ação transformadora" },
      { week: 11, objective: "Desenvolver programação, trabalho em equipe, depuração.", content: "Programação, trabalho em equipe, depuração.", skills: "PC3 (testes e iteração), EF69LP50", pillars: "Autonomia, Cooperação, Ação transformadora" },
      { week: 12, objective: "Desenvolver apresentação de jogos, escuta ativa, feedback.", content: "Apresentação de jogos, escuta ativa, feedback.", skills: "EF69LP52, EF67AR30, Competência 9 BNCC", pillars: "Autonomia, Cooperação, Ação transformadora" },
    ]
  },
  {
    cycle: 4,
    weeks: "13-16",
    guidingQuestion: "O que quero dizer ao mundo?",
    expectedProduct: "Vídeo de 60s com mensagem de impacto",
    detailedWeeks: [
      { week: 13, objective: "Desenvolver leitura de mundo, questões contemporâneas.", content: "Leitura de mundo, questões contemporâneas.", skills: "EF08LP23, EF69AR26, Competência 10 BNCC", pillars: "Contemplação, Autoavaliação, Curadoria" },
      { week: 14, objective: "Desenvolver expressão audiovisual de impacto, roteiro coletivo.", content: "Expressão audiovisual de impacto, roteiro coletivo.", skills: "EF69LP53, EF09LP26, PC2 (abstração)", pillars: "Contemplação, Autoavaliação, Curadoria" },
      { week: 15, objective: "Desenvolver edição audiovisual, autoria e finalização.", content: "Edição audiovisual, autoria e finalização.", skills: "EF67AR29, EF08LP24, Competência 7 BNCC", pillars: "Contemplação, Autoavaliação, Curadoria" },
      { week: 16, objective: "Desenvolver autoavaliação, síntese do percurso, protagonismo.", content: "Autoavaliação, síntese do percurso, protagonismo.", skills: "EF69LP52, Competência 8 e 10 BNCC", pillars: "Contemplação, Autoavaliação, Curadoria" },
    ]
  },
];

const planningFinalConsiderations = "Este guia pode ser usado como material de referência viva e em constante adaptação. Cada educador pode documentar, reinterpretar e ajustar as propostas conforme o grupo, o território e os desejos criativos emergentes. A rotina estruturante da LABirintar é uma bússola para o encantamento, a autoria e a autonomia pedagógica.";

const educators: ContentItem[] = [
  {
    title: "Educadores Curados e Formados",
    content: "A excelência na entrega é garantida por um programa de formação contínua, estruturado em três fases:",
    carouselCards: [
      {
        title: "Fase 1: Imersão LABirintar (Onboarding - 6 horas)",
        description: "Apresentação da filosofia da empresa, da metodologia de Aprendizagem Baseada em Projetos e do ecossistema. O objetivo é alinhar o EE à cultura e ao modelo de negócio da LABirintar."
      },
      {
        title: "Fase 2: Certificação LAB Cria (Capacitação Técnica - 8 horas)",
        description: "Treinamento prático no currículo de 16 semanas, com foco nas ferramentas de software (ex: Construct, CapCut) e nas estratégias pedagógicas para engajar adolescentes. Ao final, o educador recebe a certificação para lecionar o produto."
      },
      {
        title: "Fase 3: Comunidade de Prática (Desenvolvimento Contínuo)",
        description: "Encontros quinzenais online com a comunidade de EEs de tecnologia para escuta, troca de experiências, resolução de desafios de sala de aula e co-criação de novos materiais didáticos, fomentando uma cultura de organização que aprende."
      },
    ]
  },
  {
    title: "Avaliação e Resultados",
    flippableCards: [
        {
          title: "Aprendizagem Experiencial e por Projetos",
          description: "O LAB Cria enfatiza a aprendizagem prática, onde os alunos constroem seus próprios jogos e conteúdo audiovisual. A intenção é que os alunos tenham a liberdade de criar e imaginar seus próprios projetos."
        },
        {
          title: "Avaliação 'Invisível' e Contínua",
          description: "A plataforma proporcionará dados contínuos e não intrusivos sobre o desenvolvimento do aluno. Dashboards intuitivos serão apresentados a educadores e administradores escolares, destacando o progresso individual dos alunos, desafios comuns do grupo e a eficácia das atividades."
        },
        {
          title: "Gamificação Personalizada",
          description: "A IA irá além de simples pontos e emblemas. Ela adaptará os desafios e o conteúdo dentro das experiências gamificadas com base no desempenho do aluno em tempo real, garantindo que ele permaneça na sua 'zona de desenvolvimento proximal'."
        },
        {
          title: "Pedagogia Orientada a Dados",
          description: "O software é projetado para gerar dados que comprovem o desenvolvimento cognitivo e socioemocional das crianças através das atividades extracurriculares. Pesquisas já indicam que atividades como programação de jogos podem melhorar o desempenho em matemática ao desenvolver o pensamento computacional."
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

const pricing: ContentItem[] = [
  {
    title: "Laboratório Cria",
    content: (
      <div className="bg-white/60 border border-accent-blue/30 rounded-xl p-6 shadow-md w-full max-w-md">
        <div className="space-y-3">
          <p className="text-dark-text font-medium text-base">
            1x por semana – 1 hora e meia
          </p>
          <p className="text-dark-text font-medium text-base">
            2 experiências de 45 minutos
          </p>
          <p className="text-dark-text font-medium text-base">
            2 turmas simultâneas que se revezam
          </p>
          <p className="text-2xl font-extrabold text-primary mt-4">
            R$245<span className="text-base font-medium">/mês</span>
          </p>
        </div>
      </div>
    )
  }
];


const operationalProcess: ProcessStep[] = [
    {
        title: "1. Mineração",
        action: "ATRAIR",
        description: "Delimitar o contexto onde se concentram os leads para geração de uma lista densa. Esse processo é relevante para promover a implicação (“o que pega”) do lead, ou seja, fazê-lo sentir a dor para desejar o analgésico/antídoto.",
        result: "LEADS"
    },
    {
        title: "2. Prospecção",
        action: "INDICAR",
        description: "Estimular o conhecimento a respeito da solução para o problema e chegar na latência (“o quanto dói numa escala de 0 a 10”).",
        result: "PROSPECTS"
    },
    {
        title: "3. Qualificação",
        action: "PROPOSITAR",
        description: "Apresentar as proposições de valor do produto e levar o prospect à consideração de “como tem resolvido” (paliativo) para “como podemos resolver” (solução definitiva).",
        result: "AUTENTICADOS"
    },
    {
        title: "4. Ativação",
        action: "ONBOARDING",
        description: "Ajudar o usuário a navegar pela solução, torná-la familiar e engajadora. Inicia com a compra mas caminha para o início do Customer Success.",
        result: "ATIVADOS"
    },
];

const tasksMatrix: MatrixQuadrant[] = [
    {
        title: "Inbound Digital",
        icon: InboundIcon,
        description: "Ideal para nutrição de leads com conteúdo relevante e escalável, atraindo quem busca soluções proativamente.",
        details: [
            { category: "Tarefas", items: ["SEO, blog, site institucional, marketing de afiliados, marketing viral, redes sociais, inbound ads, webinars, e-mail marketing automatizado."] },
            { category: "Pessoas / Funções", items: ["Content Marketer, SEO Specialist, Social Media Manager, Web Analyst."] },
            { category: "Informações", items: ["Tráfego orgânico, taxa de conversão, jornada do visitante, leads capturados, perfil demográfico, comportamentos digitais."] },
            { category: "Tecnologias", items: ["CMS (WordPress, HubSpot), SEO tools (Ahrefs, SEMrush), plataformas de e-mail automation (Mailchimp, RD Station), Google Analytics, CRM."] },
        ]
    },
    {
        title: "Inbound Analógico",
        icon: InboundIcon,
        description: "Aproveita confiança e credibilidade física, principalmente em eventos ou através de indicação pessoal.",
        details: [
            { category: "Tarefas", items: ["Indicações boca a boca, relações públicas, feiras e eventos presenciais, networking espontâneo, distribuição de panfletos, demonstrações presenciais."] },
            { category: "Pessoas / Funções", items: ["Relações Públicas, Coordenador de Eventos, Community Manager presencial, Key Account Manager."] },
            { category: "Informações", items: ["Número de visitas presenciais, contatos feitos via referência, perfil dos participantes, feedback verbal, fluência de networking."] },
            { category: "Tecnologias", items: ["Formulários/papel, iPads ou tablets para captura de leads, CRM de importação manual, folhetos físicos, sistemas de credenciamento."] },
        ]
    },
    {
        title: "Outbound Digital",
        icon: OutboundIcon,
        description: "Prospecção ativa e segmentada, eficaz para ofertar diretamente a decisores, especialmente em B2B.",
        details: [
            { category: "Tarefas", items: ["Cold e-mails, anúncios pagos segmentados (SEM/PPC), social selling (LinkedIn Outreach), WhatsApp comercial, remarketing digital, cold display ads."] },
            { category: "Pessoas / Funções", items: ["SDR (Sales Development Rep), Growth Marketer, Paid Ads Specialist, Inside Sales."] },
            { category: "Informações", items: ["Listas segmentadas, engajamento por campanha, resposta de e-mail, dados de cliques, lead scoring."] },
            { category: "Tecnologias", items: ["Plataformas de cold e-mail (Lemlist, Outreach.io), anúncios PPC (Google Ads), ferramentas de prospecção LinkedIn, CRM, automação de marketing."] },
        ]
    },
    {
        title: "Outbound Presencial",
        icon: OutboundIcon,
        description: "Forte para relações interpessoais e confiança direta em negócios que exigem contato pessoal.",
        details: [
            { category: "Tarefas", items: ["Cold calls, visitas comerciais presenciais, mala direta, panfletagem segmentada, eventos B2B de prospecção ativa."] },
            { category: "Pessoas / Funções", items: ["Vendedor externo, Representante comercial, Field Sales, Telemarketing, Business Developer."] },
            { category: "Informações", items: ["Listas de contatos offline, respostas às visitas, conversão de reuniões presenciais, dados de follow-up, perfil do negócio prospectado."] },
            { category: "Tecnologias", items: ["Telefone, CRM de campo (Salesforce Mobile), materiais de venda impressos, tablets para apresentação, sistemas de agendamento de visitas, mala direta impressa."] },
        ]
    }
];

const AI_SYSTEM_INSTRUCTION = `You are a world-class pedagogical assistant for the 'Festival LAB Cria' program.
This program, developed by LABirintar, is an extracurricular course for middle and high school students in Brazil, focusing on digital game creation and audiovisual expression.
Your primary role is to assist educators by providing creative and practical resources that align with the program's core principles.

Core Principles to follow:
1.  **Alignment with BNCC:** All content must be aligned with Brazil's Base Nacional Comum Curricular (BNCC) and the BNCC Computacional.
2.  **Project-Based Learning:** Focus on hands-on, creative projects where students build their own games and videos.
3.  **21st Century Skills:** Emphasize creativity, logical reasoning, digital fluency, collaboration, and youth protagonism.
4.  **Engaging Content:** Create materials that are relevant and exciting for teenagers.
5.  **Structure:** The program is divided into 4 cycles of 4 weeks each. Your suggestions should ideally fit this structure.

Your tasks include:
- Generating detailed lesson plans.
- Creating activities and challenges.
- Developing assessment rubrics.
- Drafting communication models for parents (e.g., emails, updates).
- Finding and adapting content from a Digital Asset Management (DAM) system (you can simulate this by suggesting types of assets).

Always respond in Portuguese (Brazil). Be encouraging, clear, and inspiring in your tone.`;

const TOOLTIPS: { [key: string]: string } = {
    'seo': 'Search Engine Optimization (Otimização para Mecanismos de Busca): Conjunto de técnicas para melhorar o posicionamento de um site em resultados de busca como o Google.',
    'blog': 'Site ou página online, atualizada com frequência, onde se publicam artigos, posts ou outros conteúdos sobre um tema específico.',
    'site institucional': 'O site oficial de uma empresa ou organização, contendo informações sobre seus produtos, serviços e história.',
    'marketing de afiliados': 'Modelo de marketing onde uma empresa paga comissão a parceiros (afiliados) por cada cliente ou venda gerada através da divulgação do afiliado.',
    'marketing viral': 'Técnica de marketing que explora redes sociais para produzir aumentos exponenciais em conhecimento de marca, através de compartilhamento.',
    'redes sociais': 'Plataformas online como Instagram, Facebook, TikTok, etc., usadas para interação social e compartilhamento de conteúdo.',
    'inbound ads': 'Anúncios pagos que se integram a uma estratégia de Inbound Marketing, aparecendo para usuários que já demonstraram interesse em um tópico relacionado.',
    'webinars': 'Seminários ou conferências online, geralmente interativos, usados para educar e engajar um público sobre um tópico específico.',
    'e-mail marketing automatizado': 'Envio de e-mails de forma automática para uma lista de contatos, com base em gatilhos ou segmentações pré-definidas.',
    'content marketer': 'Profissional responsável por criar e distribuir conteúdo valioso e relevante para atrair e reter um público-alvo.',
    'seo specialist': 'Especialista focado em otimizar sites para que apareçam nas primeiras posições dos motores de busca.',
    'social media manager': 'Profissional que gerencia a presença e as estratégias de uma marca nas redes sociais.',
    'web analyst': 'Profissional que analisa dados de tráfego e comportamento de usuários em um site para otimizar a experiência e os resultados.',
    'cms': 'Content Management System (Sistema de Gerenciamento de Conteúdo): Software que permite criar, editar e gerenciar conteúdo digital, como o WordPress.',
    'wordpress': 'Uma das plataformas CMS mais populares do mundo, usada para criar blogs, sites e lojas virtuais.',
    'hubspot': 'Plataforma completa de software para marketing, vendas e atendimento ao cliente.',
    'ahrefs': 'Ferramenta de SEO usada para análise de backlinks, pesquisa de palavras-chave e análise de concorrentes.',
    'semrush': 'Ferramenta de marketing digital para análise de SEO, pesquisa de palavras-chave, marketing de conteúdo e análise de concorrência.',
    'mailchimp': 'Plataforma de automação de marketing e serviço de e-mail marketing.',
    'rd station': 'Plataforma brasileira líder em automação de marketing e vendas.',
    'google analytics': 'Serviço do Google que monitora e analisa o tráfego de sites.',
    'crm': 'Customer Relationship Management (Gestão de Relacionamento com o Cliente): Software para gerenciar as interações de uma empresa com clientes e prospects.',
    'indicações boca a boca': 'Recomendações feitas por clientes satisfeitos a seus amigos, familiares e contatos.',
    'relações públicas': 'Atividades de comunicação para construir e manter uma imagem positiva da marca junto ao público.',
    'networking espontâneo': 'Criação de redes de contatos profissionais de forma natural e não planejada, geralmente em eventos ou encontros sociais.',
    'key account manager': 'Gerente de Contas Estratégicas, responsável por gerenciar e desenvolver relacionamentos com os clientes mais importantes da empresa.',
    'cold e-mails': 'Envio de e-mails para prospects com os quais não houve contato prévio, como uma forma de prospecção ativa.',
    'sem/ppc': 'Search Engine Marketing / Pay-Per-Click: Marketing em mecanismos de busca, geralmente através de anúncios pagos onde o anunciante paga por clique.',
    'social selling': 'Uso de redes sociais para encontrar, conectar, entender e nutrir prospects, desenvolvendo um relacionamento que pode levar à venda.',
    'linkedin outreach': 'Estratégia de prospecção ativa utilizando a plataforma LinkedIn para contatar potenciais clientes.',
    'whatsapp comercial': 'Versão do WhatsApp para empresas, com recursos para automação, organização e resposta rápida a clientes.',
    'remarketing digital': 'Estratégia de exibir anúncios para usuários que já visitaram seu site ou interagiram com sua marca anteriormente.',
    'sdr': 'Sales Development Representative: Profissional de vendas focado na prospecção e qualificação de leads, preparando-os para a equipe de vendas.',
    'growth marketer': 'Profissional focado em estratégias e táticas de crescimento rápido para o negócio, usando marketing, dados e tecnologia.',
    'paid ads specialist': 'Especialista em criar e gerenciar campanhas de anúncios pagos em plataformas como Google Ads e redes sociais.',
    'inside sales': 'Modelo de vendas realizado remotamente, de dentro do escritório, utilizando telefone, e-mail e outras ferramentas digitais.',
    'lemlist': 'Ferramenta para automação de cold e-mails, focada em personalização para aumentar as taxas de resposta.',
    'outreach.io': 'Plataforma de engajamento de vendas que ajuda equipes a automatizar e otimizar a prospecção.',
    'google ads': 'Plataforma de publicidade do Google, onde anunciantes pagam para exibir anúncios para usuários da web.',
    'cold calls': 'Ligações telefônicas para potenciais clientes que não tiveram contato prévio com a empresa.',
    'visitas comerciais presenciais': 'Reuniões face a face com potenciais clientes para apresentar produtos ou serviços.',
    'mala direta': 'Envio de material publicitário físico (cartas, folhetos) para o endereço de clientes ou prospects.',
    'vendedor externo': 'Profissional de vendas que atua fora do escritório, visitando clientes em campo (Field Sales).',
    'field sales': 'Vendas em campo, onde o vendedor visita fisicamente os clientes e prospects.',
    'telemarketing': 'Marketing direto onde um vendedor solicita a potenciais clientes que comprem produtos ou serviços, por telefone.',
    'business developer': 'Profissional responsável por identificar e desenvolver novas oportunidades de negócio.',
    'salesforce mobile': 'Versão móvel do CRM da Salesforce, que permite que equipes de vendas gerenciem suas atividades em campo.',
};
// --- END OF CONSTANTS ---

// --- START OF SERVICES (from geminiService.ts) ---

const getAIAssistance = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch("https://assistente-vmv2jjnpua-uc.a.run.app", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    return data.text || "Resposta vazia da IA";
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    return "Ocorreu um erro ao contatar o assistente de IA: " + error;
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
              <ul className="space-y-3 mt-4 list-disc list-inside text-primary">
                {item.points.map((point, pIndex) => (
                  <li key={pIndex} className="text-dark-text/90 leading-relaxed">
                    <span className="ml-2">{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {item.flippableCards && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                          <p><span className="font-semibold text-dark-text">Habilidades BNCC:</span> {week.skills}</p>
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
      text: 'Olá! Sou seu assistente pedagógico para o Festival LAB Cria. Como posso ajudar você a planejar suas aulas, criar atividades ou desenvolver rubricas hoje?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Estado e função para o botão de teste
  const [respostaIA, setRespostaIA] = useState<string>("");

  const handlePerguntarIA = async () => {
    const resposta = await askGemini("Explique o projeto LAB Cria em 3 frases.");
    setRespostaIA(resposta);
  };

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
    "Crie um plano de aula para a semana 2 sobre fluxogramas",
    "Sugira uma atividade de 'quebra-gelo' para adolescentes",
    "Elabore uma rubrica para avaliar um jogo digital pessoal",
    "Escreva um e-mail para os pais sobre o projeto final"
  ]

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
  }

  return (
    <div className="bg-white/70 rounded-xl shadow-lg flex flex-col h-[calc(100vh-5rem)] max-h-[800px] backdrop-blur-sm border border-primary/10 animate-fade-in">
      <div className="p-4 sm:p-6 border-b border-primary/10">
        <h2 className="text-3xl font-raleway font-bold text-primary flex items-center gap-3">
          <span>{sections.ai.title}</span>
        </h2>
        <p className="text-dark-text/80 mt-2 font-raleway font-medium">{sections.ai.subtitle}</p>

        {/* Botão de teste do Gemini */}
        <button
          onClick={handlePerguntarIA}
          className="bg-primary text-white p-2 rounded mt-4"
        >
          Testar resposta IA
        </button>

        {/* Mostra a resposta do botão de teste */}
        {respostaIA && (
          <p className="mt-4 text-dark-text">
            {respostaIA}
          </p>
        )}
      </div>

      <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
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

// From components/OperationalProcess.tsx
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
    <span className="relative group inline-block">
        {children}
        <span className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-3 text-sm text-white bg-dark-text/90 rounded-md shadow-lg z-20 backdrop-blur-sm transition-opacity duration-300">
            {text}
        </span>
    </span>
);

const renderWithTooltips = (text: string) => {
    const sortedKeys = Object.keys(TOOLTIPS).sort((a, b) => b.length - a.length);
    const escapedKeys = sortedKeys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedKeys.join('|')})\\b`, 'gi');

    const parts = text.split(regex);
    
    return (
        <>
            {parts.map((part, index) => {
                const lowerPart = part.toLowerCase();
                if (TOOLTIPS[lowerPart]) {
                    return (
                        <Tooltip key={index} text={TOOLTIPS[lowerPart]}>
                            <span className="font-semibold border-b border-secondary/60 border-dotted cursor-help">{part}</span>
                        </Tooltip>
                    );
                }
                return part;
            })}
        </>
    );
};

const OperationalProcess: React.FC = () => {
    const categoryIcons: { [key in MatrixDataDetail['category']]: JSX.Element } = {
        'Tarefas': <TaskIcon />,
        'Pessoas / Funções': <PeopleIcon />,
        'Informações': <InfoIcon />,
        'Tecnologias': <TechIcon />,
    }

    return (
  <div className="bg-white/70 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm border border-primary/10 animate-fade-in">
    <div className="mb-8">
      <h2 className="text-3xl font-raleway font-bold text-primary">{sections.marketing.title}</h2>
      <p className="text-dark-text/80 mt-2 font-raleway font-medium">{sections.marketing.subtitle}</p>
    </div>

    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-raleway font-semibold text-secondary mb-6">Processos do Mercado (Customer Development)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {operationalProcess.map(step => (
            <div key={step.title} className="bg-white/60 rounded-lg p-5 border border-accent-blue/30 shadow-sm flex flex-col justify-between h-full">
              <div>
                <h4 className="font-bold font-raleway text-lg text-dark-text">{step.title}</h4>
                <div className="my-3 py-2 px-4 bg-accent-blue/20 rounded-md text-center">
                  <p className="font-extrabold text-primary tracking-widest text-sm">{step.action}</p>
                </div>
                <p className="text-sm text-dark-text/90 mb-4 leading-relaxed">{step.description}</p>
              </div>
              <div className="text-center py-2 bg-secondary/20 rounded-md text-secondary font-bold text-sm mt-auto">
                {step.result}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-raleway font-semibold text-secondary mb-6">Matriz das Tarefas Operacionais: Direção × Ambiente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasksMatrix.map(quadrant => (
            <div key={quadrant.title} className="bg-white/60 rounded-lg p-5 border border-accent-lavender/40 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-primary">{<quadrant.icon />}</span>
                <h4 className="font-bold font-raleway text-xl text-primary">{quadrant.title}</h4>
              </div>
              <p className="text-sm text-dark-text/80 italic mb-6">{quadrant.description}</p>
              <div className="space-y-4 flex-grow">
                {quadrant.details.map(detail => (
                  <div key={detail.category}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary">{categoryIcons[detail.category]}</span>
                      <h5 className="font-semibold text-dark-text">{detail.category}</h5>
                    </div>
                    <p className="text-sm text-dark-text/90 pl-7 leading-relaxed">
                      {renderWithTooltips(detail.items.join(' '))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

    /* CASO PRECISE VOLTAR COMO ERA ANTES 
    return (
        <div className="bg-white/70 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm border border-primary/10 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-raleway font-bold text-primary">{sections.marketing.title}</h2>
                <p className="text-dark-text/80 mt-2 font-raleway font-medium">{sections.marketing.subtitle}</p>
            </div>

            <div className="space-y-12">
                <div>
                    <h3 className="text-2xl font-raleway font-semibold text-secondary mb-6">Processos do Mercado (Customer Development)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {operationalProcess.map(step => (
                            <div key={step.title} className="bg-white/60 rounded-lg p-5 border border-accent-blue/30 shadow-sm">
                                <h4 className="font-bold font-raleway text-lg text-dark-text">{step.title}</h4>
                                <div className="my-3 py-2 px-4 bg-accent-blue/20 rounded-md text-center">
                                    <p className="font-extrabold text-primary tracking-widest text-sm">{step.action}</p>
                                </div>
                                <p className="text-sm text-dark-text/90 mb-4 leading-relaxed">{step.description}</p>
                                <div className="text-center py-2 bg-secondary/20 rounded-md text-secondary font-bold text-sm">
                                    {step.result}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-raleway font-semibold text-secondary mb-6">Matriz das Tarefas Operacionais: Direção × Ambiente</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tasksMatrix.map(quadrant => (
                            <div key={quadrant.title} className="bg-white/60 rounded-lg p-5 border border-accent-lavender/40 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-primary">{<quadrant.icon />}</span>
                                    <h4 className="font-bold font-raleway text-xl text-primary">{quadrant.title}</h4>
                                </div>
                                <p className="text-sm text-dark-text/80 italic mb-6">{quadrant.description}</p>
                                <div className="space-y-4 flex-grow">
                                    {quadrant.details.map(detail => (
                                        <div key={detail.category}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-secondary">{categoryIcons[detail.category]}</span>
                                                <h5 className="font-semibold text-dark-text">{detail.category}</h5>
                                            </div>
                                            <p className="text-sm text-dark-text/90 pl-7 leading-relaxed">{renderWithTooltips(detail.items.join(' '))}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );*/
};

// --- END OF COMPONENTS ---


// --- START OF APP (from App.tsx) ---

type SectionKey = 'vision' | 'implementation' | 'planning' | 'educators' | 'materials' | 'marketing' | 'ai';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>('vision');

  const navItems = [
    { key: 'vision', text: 'Visão Estratégica' },
    { key: 'implementation', text: 'Implementação' },
    { key: 'planning', text: 'Planejamento' },
    { key: 'educators', text: 'Educadores' },
    { key: 'materials', text: 'Materiais' },
    { key: 'pricing', text: 'Precificação' },
    { key: 'marketing', text: 'Processo Operacional' },
    { key: 'ai', text: 'Assistente IA' },
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
      case 'pricing':
        return <SectionCard title={sections.pricing.title} subtitle={sections.pricing.subtitle} content={pricing as ContentItem[]} />;
      case 'marketing':
        return <OperationalProcess />;
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
            <h1 className="text-2xl font-raleway font-bold text-primary">Festival LAB Cria</h1>
            <p className="text-sm text-dark-text/80 font-raleway -mt-1 leading-tight">Criação de Jogos Digitais e Expressão Audiovisual</p>
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
            <img src="../logosLabirintar/Logo2.png" alt="LABirintar Logo" className="h-14 mx-auto opacity-100" />
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
