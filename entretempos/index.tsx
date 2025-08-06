

// --- From types.ts ---
interface Trail {
  name: string;
  concept: string;
  activities: string;
  materials: string;
  bncc: string;
  competencies: string;
}

// --- From constants.tsx ---
const trailsData: Trail[] = [
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

const ChevronDownIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const SectionTitle = ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-sans font-bold text-center text-slate-800 mb-4">{children}</h2>
);

const SectionSubtitle = ({ children }) => (
    <p className="text-lg text-center text-slate-600 max-w-3xl mx-auto mb-12">{children}</p>
);


// --- From App.tsx ---
const Nav = () => {
    const navItems = [
        { name: 'O que é', href: '#about' },
        { name: 'Metodologia', href: '#methodology' },
        { name: 'Trilhas', href: '#trails' },
        { name: 'Implementação', href: '#implementation' },
        { name: 'Catálogo', href: '#catalog' },
        { name: 'Impacto', href: '#impact' },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-sm">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <a href="#" className="text-2xl font-inter font-bold text-primary">Entretempos</a>
                <div className="hidden md:flex space-x-6 items-center">
                    {navItems.map(item => (
                        <a key={item.name} href={item.href} className="text-slate-600 hover:text-primary transition-colors duration-300">{item.name}</a>
                    ))}
                    <a
                        href="https://wa.me/5511912303004"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-secondary text-white font-semibold px-4 py-2 rounded-full hover:bg-opacity-90 transition-all duration-300"
                        >
                        Contato
                        </a>
                </div>
            </nav>
        </header>
    );
};

const Hero = () => (
    <section className="min-h-screen bg-accent1/20 flex items-center pt-20 relative">
        <div
            className="absolute inset-0 z-0 opacity-10"
            style={{
                backgroundImage: `url(./imagens/crianca-fundo-cima.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
        <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight mb-4">
                <span className="text-primary">Entretempos:</span> Vivências de Educação Integral
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8">
                Ressignificando o tempo e o espaço escolar para transformar a educação pública na Primeira Infância.
            </p>
        </div>
    </section>
);


const AboutName = () => (
    <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <SectionTitle>O porquê do nome "Entretempos"</SectionTitle>
            <SectionSubtitle>
                O nome "Entretempos" captura a essência da proposta: atuar no tempo "entre" os turnos escolares, nos interstícios e intervalos que, muitas vezes, são vistos como meras pausas.
            </SectionSubtitle>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="prose prose-lg text-slate-700 max-w-none">
                    <p>O programa ressignifica esse "entretempo", transformando-o de um espaço vazio em um <strong className="text-secondary">campo fértil para a experiência, a criação e o vínculo.</strong></p>
                    <p>"Entretempos" sugere um tempo que se tece de forma diferente, <strong className="text-secondary">mais lento, sensível e poético,</strong> em contraponto à aceleração do tempo produtivo.</p>
                    <p>"Vivências de Educação Integral" complementa a ideia, destacando a abordagem metodológica que valoriza a experiência e a integralidade do desenvolvimento infantil no coração desses momentos.</p>
                </div>
                <div className="w-full h-[500px] overflow-hidden rounded-xl shadow-2xl">
                    <img
                        src="./imagens/crianca-fundo-cima2.jpg"
                        alt="Crianças brincando"
                        className="w-full h-full object-cover object-center"
                    />
                    </div>
            </div>
        </div>
    </section>
);

const VisionAndPurpose = () => (
    <section id="vision" className="py-20 bg-backgroundLight">
        <div className="container mx-auto px-6">
            <SectionTitle>Visão e Propósito</SectionTitle>
            <SectionSubtitle>
                Reinventando o Tempo e o Espaço Escolar com uma premissa fundamental: a Educação Integral é, antes de tudo, "um modo de ver, viver e fazer educação".
            </SectionSubtitle>
            <div className="text-center max-w-4xl mx-auto prose prose-xl text-slate-700">
                <p>É um convite à ampliação radical dos sentidos atribuídos ao tempo, à escola, ao aprender e ao ser humano. Em um cenário dominado por metas e planilhas, a proposta emerge como uma <strong className="text-primary">"resposta viva"</strong>, comprometida com a <strong className="text-primary">"reencantação do tempo escolar"</strong>.</p>
                <p>Ancorado em políticas como o PNE e a BNCC, o programa não busca apenas "ocupar o contraturno", mas sim <strong className="text-primary">"reinventar o tempo escolar como tempo de mundo"</strong>, promovendo uma "densidade de vivência, em presença plena, em delicadeza".</p>
            </div>
        </div>
    </section>
);


const Methodology = () => (
    <section id="methodology" className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <SectionTitle>Fundamentação da Metodologia</SectionTitle>
             <SectionSubtitle>
               Nossa metodologia é validada pelo alinhamento com pesquisas de vanguarda, notadamente os trabalhos fomentados pelo Instituto Alana, como "Território do Brincar" e "Quintais Brincantes".
            </SectionSubtitle>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-accent2/20 p-8 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Escuta Atenta</h3>
                    <p className="text-slate-600">Nossos princípios incluem a escuta atenta aos brincares, o respeito ao tempo das infâncias e a conexão profunda com a natureza e a cultura popular.</p>
                </div>
                <div className="bg-accent2/20 p-8 rounded-xl shadow-md">
                     <h3 className="text-2xl font-bold text-slate-800 mb-3">Desemparedamento</h3>
                    <p className="text-slate-600">Promovemos o "desemparedamento de espaços e pessoas", mobilizando processos de aprendizagem baseados na natureza e inspirados na cultura popular brasileira.</p>
                </div>
                <div className="bg-accent2/20 p-8 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Segurança e Validação</h3>
                    <p className="text-slate-600">Para o gestor público, nosso alinhamento com referenciais de renome mitiga riscos, tornando a contratação uma decisão estratégica e segura.</p>
                </div>
            </div>
        </div>
    </section>
);


const ExperienceTrails = () => (
     <section id="trails" className="py-20 bg-backgroundLight">
        <div className="container mx-auto px-6">
            <SectionTitle>As Trilhas de Experiência</SectionTitle>
            <SectionSubtitle>
                Nosso portfólio transcende um mero cardápio de atividades. As trilhas são concebidas como um "ecossistema de experiências" interconectado, flexível e adaptável.
            </SectionSubtitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trailsData.slice(0, 6).map(trail => (
                    <div key={trail.name} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        <h3 className="text-xl font-bold text-primary mb-2">{trail.name}</h3>
                        <p className="text-slate-600 text-sm">{trail.activities}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ImplementationStrategy = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const strategies = [
        { name: "Pequeno Porte", students: "Até 5.000 alunos", description: "Início como projeto piloto em escolas limitadas. Formação majoritariamente remota via Google Meet, com suporte direto da equipe central. O objetivo é validar o modelo e gerar um case de sucesso." },
        { name: "Médio Porte", students: "5.000 a 20.000 alunos", description: "Estratégia de \"densificação\". Identificação de \"Educadores Multiplicadores\" para formar pares. A plataforma de dados gera insights robustos para a secretaria municipal." },
        { name: "Grande Rede", students: "Acima de 20.000 alunos", description: "Implementação por fases (ex: por diretorias). Estrutura de formação em rede com múltiplos \"Educadores Multiplicadores\". A geração de dados torna-se estratégica para a governança de toda a rede." },
    ];

    return (
        <section id="implementation" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle>Estratégia de Implementação Adaptativa</SectionTitle>
                <SectionSubtitle>Oferecemos um plano flexível que se adapta à escala e às características de cada município contratante.</SectionSubtitle>
                <div className="max-w-4xl mx-auto">
                    <div className="flex border-b border-gray-200">
                        {strategies.map((strategy, index) => (
                             <button
                                key={strategy.name}
                                onClick={() => setActiveTab(index)}
                                className={`py-4 px-6 block font-semibold text-lg focus:outline-none ${activeTab === index ? 'border-b-4 border-primary text-primary' : 'text-slate-500 hover:text-primary'}`}
                            >
                                {strategy.name}
                            </button>
                        ))}
                    </div>
                    <div className="mt-8">
                        {strategies.map((strategy, index) => (
                            <div key={strategy.name} className={`${activeTab === index ? 'block' : 'hidden'}`}>
                                <h3 className="text-2xl font-bold text-slate-800">{strategy.name} <span className="text-lg font-normal text-slate-500">({strategy.students})</span></h3>
                                <p className="mt-4 text-lg text-slate-600">{strategy.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const ImplementationGuide = () => {
    const steps = [
        { title: "Diagnóstico Sensível e Alinhamento", description: "A jornada começa com a escuta para compreender realidades locais, alinhar a proposta ao PPP da escola e mapear os espaços." },
        { title: "Formação e Sensibilização da Equipe", description: "Capacitação dos educadores para o uso autônomo e poético das trilhas, combinando encontros online, materiais na plataforma e encontros presenciais." },
        { title: "Lançamento e Acompanhamento Contínuo", description: "As trilhas ganham vida nas escolas. Acompanhamento próximo da LABirintar com encontros quinzenais on-line e um canal de feedback constante." },
        { title: "Engajamento das Famílias e Comunidade", description: "A transformação é um esforço coletivo. Fornecemos estratégias para engajar pais e responsáveis, tornando as famílias aliadas no processo." }
    ];

    return (
        <section id="guide" className="py-20 bg-backgroundLight">
            <div className="container mx-auto px-6">
                <SectionTitle>Jornada de Implementação: Um Roteiro Colaborativo</SectionTitle>
                <SectionSubtitle>Nossa implementação é uma parceria que respeita e se integra à cultura de cada rede de ensino.</SectionSubtitle>
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute left-1/2 top-0 h-full w-0.5 bg-accent1/50 transform -translate-x-1/2"></div>
                    {steps.map((step, index) => (
                        <div key={step.title} className="relative mb-12 flex justify-center">
                            <div className="absolute left-1/2 top-[-1rem] w-6 h-6 bg-primary rounded-full transform -translate-x-1/2 border-4 border-backgroundLight z-10"></div>
                            <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12 md:text-left' : 'md:pr-12 md:text-right'}`}>
                                <div className="bg-white p-6 rounded-xl shadow-md">
                                    <h4 className="text-xl font-bold text-primary mb-2">Movimento {index + 1}: {step.title}</h4>
                                    <p className="text-slate-600">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const EducatorGuide = () => {
    const tools = [
        { title: "Trilha Formativa Contínua", description: "Uma travessia contínua com encontros online, acervo digital vivo e uma comunidade de prática para troca e colaboração." },
        { title: "Planejamento com IA", description: "Ferramentas de IA como parceiros de brainstorming para liberar o educador de tarefas repetitivas e potencializar sua criatividade." },
        { title: "Avaliação Poética e Documentação Sensível", description: "Foco no acompanhamento qualitativo da experiência vivida, registrando gestos, brincadeiras e produções para compreender a aprendizagem." }
    ];

    return (
        <section id="educator-guide" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle>Guia do Educador da Rede Pública</SectionTitle>
                <SectionSubtitle>Oferecemos as ferramentas para que o educador atue como um "mediador do encantamento, curador de vivências e escutador do tempo".</SectionSubtitle>
                <div className="grid md:grid-cols-3 gap-8">
                    {tools.map(tool => (
                         <div key={tool.title} className="bg-accent1/20 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">{tool.title}</h3>
                            <p className="text-slate-600">{tool.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TrailCard = ({ trail }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105">
        <div className="bg-primary text-white p-4">
            <h3 className="font-bold text-xl">{trail.name}</h3>
        </div>
        <div className="p-6 flex-grow space-y-4">
            <div>
                <h4 className="font-semibold text-secondary">Conceito Central</h4>
                <p className="text-sm text-slate-600">{trail.concept}</p>
            </div>
            <div>
                <h4 className="font-semibold text-secondary">Principais Atividades</h4>
                <p className="text-sm text-slate-600">{trail.activities}</p>
            </div>
             <div>
                <h4 className="font-semibold text-secondary">Materialidades/Kits</h4>
                <p className="text-sm text-slate-600">{trail.materials}</p>
            </div>
             <div>
                <h4 className="font-semibold text-secondary">Campos de Experiência (BNCC)</h4>
                <p className="text-sm text-slate-600">{trail.bncc}</p>
            </div>
             <div>
                <h4 className="font-semibold text-secondary">Competências do Séc. XXI</h4>
                <p className="text-sm text-slate-600">{trail.competencies}</p>
            </div>
        </div>
    </div>
);


const TrailsCatalog = () => (
    <section id="catalog" className="py-20 bg-backgroundLight">
        <div className="container mx-auto px-6">
            <SectionTitle>Catálogo Detalhado das Trilhas</SectionTitle>
            <SectionSubtitle>Cada trilha é uma porta de entrada para um universo de aprendizagem, com objetivos, materialidades e conexões curriculares claras.</SectionSubtitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trailsData.map(trail => (
                    <TrailCard key={trail.name} trail={trail} />
                ))}
            </div>
        </div>
    </section>
);

const ImpactMeasurement = () => (
    <section id="impact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <SectionTitle>Mensuração de Impacto e Inteligência para Políticas Públicas</SectionTitle>
            <SectionSubtitle>Transformamos dados em inteligência acionável, tornando-nos parceiros na construção de políticas públicas baseadas em evidências.</SectionSubtitle>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-accent2/20 p-8 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Modelo Híbrido</h3>
                    <p className="text-slate-600">Integramos a profundidade da "documentação sensível" (qualitativa) com a escala da coleta de dados de engajamento e participação (quantitativa) pela plataforma.</p>
                </div>
                 <div className="bg-accent2/20 p-8 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Labirintar Data</h3>
                    <p className="text-slate-600">Nossa unidade de negócio dedicada a transformar dados em dashboards de gestão em tempo real, análises de engajamento e análises preditivas.</p>
                </div>
                 <div className="bg-accent2/20 p-8 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Parceria Estratégica</h3>
                    <p className="text-slate-600">Deixamos de ser um fornecedor de serviço para nos tornarmos um parceiro estratégico na governança educacional, gerando valor para planejamento, gestão e inovação.</p>
                </div>
            </div>
        </div>
    </section>
);


const Footer = () => (
    <footer id="contact" className="bg-[#aec5e7] text-slate-700">
        <div className="container mx-auto px-6 py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Vamos transformar a educação juntos?</h2>
            <p className="text-slate-700 mb-8 max-w-2xl mx-auto">Entre em contato para saber como o Entretempos pode ser implementado em seu município.</p>
            <button className="bg-secondary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 transition-transform duration-300 inline-block transform hover:scale-105 shadow-lg">
                Fale Conosco
            </button>
            <div className="mt-12 border-t border-slate-700 pt-8">
                <p className="text-slate-400">&copy; {new Date().getFullYear()} Entretempos. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
);


function App() {
  return (
    <div className="font-sans bg-white">
      <Nav />
      <main>
        <Hero />
        <AboutName />
        <VisionAndPurpose />
        <Methodology />
        <ExperienceTrails />
        <ImplementationStrategy />
        <ImplementationGuide />
        <EducatorGuide />
        <TrailsCatalog />
        <ImpactMeasurement />
      </main>
      <Footer />
    </div>
  );
}

// --- From original index.tsx ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
