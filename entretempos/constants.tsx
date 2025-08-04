
import React from 'react';
import { Trail } from './types';

export const trailsData: Trail[] = [
  {
    name: 'Infância Sem Excesso',
    concept: 'Desaceleração, essencialidade, consumo consciente. (Ref: Infância Sem Excesso, Quintais Brincantes)',
    activities: 'Ateliê de arte miúda, brincar com materiais não estruturados (papel, retalhos, sucatas), exploração de um único material por vez, ocupação de espaços não convencionais.',
    materials: 'Materiais simples e reutilizáveis: papel, tecidos, caixas, fitas, elementos da natureza. Kit de "sementes" para ateliês.',
    bncc: 'Traços, sons, cores e formas; Espaços, tempos, quantidades, relações e transformações; O eu, o outro e o nós.',
    competencies: 'Criatividade, Pensamento Crítico, Sustentabilidade.',
  },
  {
    name: 'CidadeVamos',
    concept: 'A cidade como território educativo e poético. (Ref: Cidades Educadoras, Território do Brincar, Quintais Brincantes)',
    activities: 'Cartografias sensíveis do entorno da escola, percursos com "olhos de criança", criação de mapas afetivos, diálogos com a memória do bairro, mini-documentários.',
    materials: 'Cadernos de campo, câmeras (celular), gravadores de áudio, mapas, objetos coletados nos passeios.',
    bncc: 'Espaços, tempos, quantidades, relações e transformações; Escuta, fala, pensamento e imaginação; O eu, o outro e o nós.',
    competencies: 'Curiosidade, Colaboração, Comunicação, Cidadania.',
  },
  {
    name: 'Pequenos Meditadores',
    concept: 'Mindfulness, educação emocional, autoconhecimento. (Ref: Práticas de atenção plena para crianças)',
    activities: 'Meditações guiadas com histórias, brincadeiras com a respiração, atividades de concentração ("só um"), rotinas de escuta afetiva e partilha de sentimentos.',
    materials: 'Áudios com meditações guiadas, objetos sensoriais (penas, sinos), livros com histórias temáticas.',
    bncc: 'O eu, o outro e o nós; Corpo, gestos e movimentos; Escuta, fala, pensamento e imaginação.',
    competencies: 'Inteligência Emocional, Autocontrole, Empatia.',
  },
  {
    name: 'Portô Portêr (Circo)',
    concept: 'Corpo como linguagem, risco criativo, cooperação. (Ref: Tradição do circo popular brasileiro)',
    activities: 'Travessias poéticas na trave de equilíbrio, circuitos de malabares, exploração do trapézio, jogos colaborativos com acrobacias simples, criação de mini-espetáculos.',
    materials: 'Kit Circense: trave modular, trapézio, slackline, bolas de malabares, tecidos, colchonetes.',
    bncc: 'Corpo, gestos e movimentos; O eu, o outro e o nós; Traços, sons, cores e formas.',
    competencies: 'Resiliência, Colaboração, Criatividade, Autoconfiança.',
  },
  {
    name: 'Seu Filão (Cozinha)',
    concept: 'Pedagogia do gesto, saberes manuais, cultura alimentar. (Ref: Panificação artesanal, Cozinhas dos Quintais Brincantes)',
    activities: 'Confecção de pães simples, exploração sensorial de ingredientes, sovar a massa, acompanhar o tempo do fermento, roda de partilha do alimento.',
    materials: 'Kit básico com ingredientes (farinha, fermento), utensílios simples, cadernos de receita ilustrados.',
    bncc: 'Espaços, tempos, quantidades, relações e transformações; O eu, o outro e o nós; Traços, sons, cores e formas.',
    competencies: 'Paciência, Colaboração, Consciência de Processos.',
  },
  {
    name: 'Brinquedos do Quintal',
    concept: 'Resgate da cultura da infância e do brincar tradicional brasileiro. (Ref: Quintais Brincantes, Território do Brincar)',
    activities: 'Vivências com brinquedos tradicionais, brincadeiras cantadas e jogos de roda, construção de brinquedos com materiais da natureza.',
    materials: 'Não estruturados, elementos da natureza, acervo de cantigas e brincadeiras populares.',
    bncc: 'O eu, o outro e o nós; Corpo, gestos e movimentos; Escuta, fala, pensamento e imaginação.',
    competencies: 'Colaboração, Consciência Cultural.',
  },
];

export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">{children}</h2>
);

export const SectionSubtitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-lg text-center text-slate-600 max-w-3xl mx-auto mb-12">{children}</p>
);
