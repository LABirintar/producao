import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- TYPES ---

export type QuestionType = 'multiple-choice' | 'text' | 'image-text';

export interface Question {
  id: string;
  block: number;
  type: QuestionType;
  text: string;
  subtext?: string;
  options?: string[];
  isMultiSelect?: boolean;
  image?: {
    src: string;
    alt: string;
  };
  prompts?: string[];
}

export type Answer = string | string[] | { [key: string]: string };

export interface Answers {
  [key: string]: Answer;
}

// --- COMPONENTS ---

// ProgressBar.tsx
interface ProgressBarProps {
  progress: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-brand-lavender rounded-full h-2.5">
      <div
        className="bg-brand-red h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// WelcomeScreen.tsx
interface WelcomeScreenProps {
  onStart: () => void;
}
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-brand-red mb-4">
        Formulário diagnóstico - Tecnologia
      </h1>
      <h2 className="text-xl md:text-2xl text-gray-700 font-semibold mb-6">
        Entremundos: Um convite para pensar e sentir tecnologia
      </h2>
      <div className="text-left text-gray-600 space-y-4 text-lg">
        <p>
          Ei, antes de tudo: este formulário não é uma prova, nem uma entrevista.
        </p>
        <p>
          É um convite pra você parar um pouco e pensar.
          A gente quer saber: o que você curte, o que te dá preguiça, o que você gostaria de
          aprender, criar, descobrir, transformar quando o assunto é tecnologia.
        </p>
        <p>
          Fique à vontade. Responda com sinceridade. Isso é pra você e sobre você.
        </p>
      </div>
      <button
        onClick={onStart}
        className="mt-10 inline-flex items-center gap-3 text-xl font-bold bg-brand-red hover:brightness-95 active:brightness-90 text-white py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
      >
        Bora?
      </button>
    </div>
  );
};

// QuestionComponent.tsx
interface QuestionComponentProps {
  question: Question;
  questionNumber: number;
  onAnswerChange: (questionId: string, answer: Answer) => void;
  currentAnswer?: Answer;
}
const QuestionComponent: React.FC<QuestionComponentProps> = ({ question, questionNumber, onAnswerChange, currentAnswer }) => {
  const [otherText, setOtherText] = useState('');

  useEffect(() => {
    if (question.isMultiSelect && question.options?.includes('Outros')) {
      const currentSelection = (Array.isArray(currentAnswer) ? currentAnswer : []) as string[];
      const otherValue = currentSelection.find(s => s.startsWith('Outros: '));
      setOtherText(otherValue ? otherValue.replace('Outros: ', '') : '');
    }
  }, [currentAnswer, question]);

  const handleCheckboxChange = (option: string) => {
    const currentSelection = (Array.isArray(currentAnswer) ? currentAnswer : []) as string[];
    let newSelection;

    if (currentSelection.includes(option)) {
      newSelection = currentSelection.filter(item => item !== option);
      if (option === 'Outros') {
        newSelection = newSelection.filter(item => !item.startsWith('Outros: '));
        setOtherText('');
      }
    } else {
      newSelection = [...currentSelection, option];
    }
    onAnswerChange(question.id, newSelection);
  };
  
  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setOtherText(newText);
    
    const currentSelection = (Array.isArray(currentAnswer) ? currentAnswer : []) as string[];
    const baseSelection = currentSelection.filter(item => !item.startsWith('Outros: '));

    if (newText) {
      onAnswerChange(question.id, [...baseSelection, `Outros: ${newText}`]);
    } else {
      onAnswerChange(question.id, baseSelection);
    }
  };

  const isOptionChecked = (option: string): boolean => {
      const currentSelection = (Array.isArray(currentAnswer) ? currentAnswer : []) as string[];
      return currentSelection.includes(option);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{questionNumber}. {question.text}</h2>
      {question.subtext && <p className="text-md text-gray-500 mb-6">{question.subtext}</p>}

      {question.type === 'multiple-choice' && (
        <div className="space-y-4">
          {question.options?.map((option, index) => {
            const isChecked = isOptionChecked(option);
            return (
              <div key={option}>
                <label className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors border-2 ${isChecked ? 'bg-brand-lavender border-brand-red' : 'bg-white border-gray-300'} hover:border-brand-red/70`}>
                  <input
                    type="checkbox"
                    name={question.id}
                    value={option}
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(option)}
                    className="h-6 w-6 rounded-md border-gray-400 accent-brand-red text-brand-red focus:ring-brand-red focus:ring-2 shrink-0"
                  />
                  <span className="ml-4 text-lg text-gray-800">
                    <b className="font-semibold mr-2">{String.fromCharCode(97 + index)})</b>
                    {option}
                  </span>
                </label>
                {option === 'Outros' && isChecked && (
                  <div className="mt-2 ml-10">
                    <input
                      type="text"
                      placeholder="Por favor, especifique"
                      value={otherText}
                      onChange={handleOtherTextChange}
                      className="w-full bg-gray-50 border-gray-300 rounded-md p-2 text-gray-800 placeholder-gray-500 focus:ring-brand-red focus:border-brand-red"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      {question.type === 'text' && (
        <textarea
          rows={5}
          value={(typeof currentAnswer === 'string' ? currentAnswer : '')}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
          className="w-full bg-gray-50 border-gray-300 rounded-lg p-4 text-gray-800 placeholder-gray-500 focus:ring-brand-red focus:border-brand-red text-lg"
          placeholder="Sinta-se à vontade para escrever..."
        ></textarea>
      )}
    </div>
  );
};

// ImageQuestionComponent.tsx
interface ImageQuestionComponentProps {
  question: Question;
  questionNumber: number;
  onAnswerChange: (questionId: string, answer: Answer) => void;
  currentAnswer?: Answer;
}
const ImageQuestionComponent: React.FC<ImageQuestionComponentProps> = ({ question, questionNumber, onAnswerChange, currentAnswer }) => {
  const answers = typeof currentAnswer === 'object' && currentAnswer !== null && !Array.isArray(currentAnswer) ? currentAnswer : {};

  const handleTextChange = (promptIndex: number, text: string) => {
    onAnswerChange(question.id, {
      ...answers,
      [`prompt${promptIndex + 1}`]: text,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">{questionNumber}. {question.text}</h2>
      <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
        <div className="lg:w-1/2 w-full">
          {question.image && (
            <img
              src={question.image.src}
              alt={question.image.alt}
              className="rounded-lg shadow-lg object-cover w-full h-auto aspect-video"
            />
          )}
        </div>
        <div className="lg:w-1/2 w-full space-y-6">
          {question.prompts?.map((prompt, index) => (
            <div key={index}>
              <label className="block text-lg font-semibold text-gray-700 mb-2">{prompt}</label>
              <textarea
                rows={4}
                value={(answers as any)[`prompt${index + 1}`] || ''}
                onChange={(e) => handleTextChange(index, e.target.value)}
                className="w-full bg-gray-50 border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-500 focus:ring-brand-red focus:border-brand-red"
                placeholder="Suas ideias aqui..."
              ></textarea>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ThankYouScreen.tsx
const ThankYouScreen: React.FC = () => {
  return (
    <div className="text-center max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold text-brand-orange mb-4">Obrigado!</h1>
      <p className="text-xl text-gray-700">
        Suas respostas foram enviadas com sucesso.
      </p>
      <p className="text-lg text-gray-600 mt-4">
        Agradecemos por compartilhar suas ideias e sentimentos com a gente. Sua participação é muito importante!
      </p>
    </div>
  );
};

// --- MAIN APP ---

const App: React.FC = () => {
  // IMPORTANT: Replace this with your actual Google Apps Script Web App URL
  const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

  const surveyQuestions: Question[] = [
    {
      id: 'q1',
      block: 1,
      type: 'multiple-choice',
      text: 'Quando você pensa em tecnologia, o que vem à sua cabeça?',
      subtext: '(escolha livre + múltipla escolha com sugestões)',
      isMultiSelect: true,
      options: ['Jogos', 'Celular', 'Inteligência Artificial', 'Redes sociais', 'Computador', 'Streaming / YouTube', 'Robôs', 'Outros'],
    },
    {
      id: 'q2',
      block: 1,
      type: 'multiple-choice',
      text: 'O que você mais curte fazer quando está online?',
      subtext: '(pode escolher mais de uma opção)',
      isMultiSelect: true,
      options: ['Jogar', 'Criar (vídeos, músicas, memes, textos, etc.)', 'Assistir coisas', 'Conversar', 'Pesquisar/descobrir', 'Editar imagens ou vídeos', 'Programar', 'Nada disso, prefiro o mundo fora da tela'],
    },
    {
      id: 'q3',
      block: 1,
      type: 'text',
      text: 'Existe alguma coisa no mundo digital que te cansa ou te incomoda?',
      subtext: '(resposta aberta)',
    },
    {
      id: 'q4',
      block: 1,
      type: 'text',
      text: 'Você já quis aprender a fazer algo usando tecnologia, mas nunca teve a chance?',
      subtext: '(resposta aberta)',
    },
    {
      id: 'q5',
      block: 1,
      type: 'multiple-choice',
      text: 'Qual dessas frases mais parece com você?',
      subtext: '(escolha uma ou mais)',
      isMultiSelect: true,
      options: [
        'Gosto de aprender coisas novas, mas tem que ser do meu jeito',
        'Curto resolver problemas difíceis',
        'Tenho um monte de ideias, mas não sei por onde começar',
        'Prefiro experimentar do que ficar ouvindo explicação',
        'Acho que tecnologia pode mudar o mundo (só não sei como)',
        'Me irrita quando acham que eu não entendo nada',
        'Às vezes me sinto viciado no celular',
        'Tecnologia pra mim é só mais uma coisa — não tudo',
      ],
    },
    {
      id: 'q6',
      block: 1,
      type: 'multiple-choice',
      text: 'Quais temas ou áreas abaixo você teria vontade de explorar mais?',
      subtext: '(escolha as que quiser)',
      isMultiSelect: true,
      options: ['Criar jogos digitais', 'Inteligência artificial', 'Podcasts e vídeos', 'Programação', 'Robótica', 'Edição de imagem ou vídeo', 'Pensar sobre redes sociais (comunicação, influência, algoritmo, etc)', 'Cyberbullying, segurança e saúde mental', 'Sustentabilidade e tecnologia', 'Arte e tecnologia', 'Outros'],
    },
    {
      id: 'q7',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_1.jpg', alt: '' },
      prompts: ['Você já viveu algo parecido?', 'Se pudesse criar algo com tecnologia agora, o que seria?'],
    },
    {
      id: 'q8',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_2.jpg', alt: '' },
      prompts: ['Alguma dessas redes faz parte do seu universo?', 'O que te fascina e o que te cansa nesse "céu digital"?'],
    },
    {
      id: 'q9',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_3.jpg', alt: '' },
      prompts: ['O que você escolheria se tivesse que criar um projeto digital: Controle? Criatividade? Caos? Explique por quê.'],
    },
    {
      id: 'q10',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_4.jpg', alt: '' },
      prompts: ['O que passa pela sua cabeça quando está só com você e sua música?'],
    },
    {
      id: 'q11',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_5.jpg', alt: '' },
      prompts: ['O que você sente quando está com muita gente... mas ninguém está de verdade?'],
    },
    {
      id: 'q12',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_6.jpg', alt: '' },
      prompts: ['Você se imagina vivendo dentro de um mundo criado por uma tela? Como seria esse lugar?'],
    },
    {
      id: 'q13',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_7.jpg', alt: '' },
      prompts: ['Você sente que sua vida acontece mais dentro ou fora das telas? Onde está sua potência?'],
    },
    {
      id: 'q14',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_8.jpg', alt: '' },
      prompts: ['Você se vê como criador de tecnologia ou apenas usuário dela?'],
    },
    {
      id: 'q15',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_9.jpg', alt: '' },
      prompts: ['Quando seu corpo fala mais que o teclado?'],
    },
    {
      id: 'q16',
      block: 2,
      type: 'image-text',
      text: '',
      image: { src: '/imagens/img_10.jpg', alt: '' },
      prompts: ['Quantas versões de você existem? O que você mostra? O que você esconde?'],
    },
  ];
  
  const [currentStep, setCurrentStep] = useState(-1); // -1 for welcome screen
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [isCurrentAnswerValid, setIsCurrentAnswerValid] = useState(false);

  const totalQuestions = surveyQuestions.length;
  const progress = currentStep >= 0 ? ((currentStep + 1) / totalQuestions) * 100 : 0;
  const currentQuestion = surveyQuestions[currentStep];

  const validateAnswer = useCallback((question: Question, answer: Answer): boolean => {
    if (!question) return false;

    switch (question.type) {
      case 'text':
        return !!answer && typeof answer === 'string' && answer.trim() !== '';
      case 'multiple-choice':
        return !!answer && Array.isArray(answer) && answer.length > 0;
      case 'image-text': {
        if (!question.prompts || !answer || typeof answer !== 'object' || Array.isArray(answer)) {
            return false;
        }
        const answerValues = Object.values(answer);
        return question.prompts.length === answerValues.length && answerValues.every(val => typeof val === 'string' && val.trim() !== '');
      }
      default:
        return false;
    }
  }, []);
  
  useEffect(() => {
    if (currentQuestion) {
      const isValid = validateAnswer(currentQuestion, answers[currentQuestion.id]);
      setIsCurrentAnswerValid(isValid);
    }
  }, [answers, currentQuestion, validateAnswer]);

  const handleStart = () => setCurrentStep(0);

  const handleAnswerChange = useCallback((questionId: string, answer: Answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleNext = () => {
    if (isCurrentAnswerValid && currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isCurrentAnswerValid) return;
    setStatus('submitting');
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...answers, submissionTimestamp: new Date().toISOString() }),
        });
        
        setStatus('submitted');

    } catch (error) {
        console.error('Error submitting form:', error);
        setStatus('error');
    }
  };

  const renderContent = () => {
    if (status === 'submitted') {
      return <ThankYouScreen />;
    }
    
    if (status === 'error') {
        return (
            <div className="text-center text-brand-red">
                <h2 className="text-2xl font-bold mb-4">Oops! Algo deu errado.</h2>
                <p>Não foi possível enviar suas respostas. Por favor, tente novamente mais tarde.</p>
            </div>
        );
    }
    
    if (currentStep === -1) {
      return <WelcomeScreen onStart={handleStart} />;
    }

    if (currentQuestion) {
      return (
        <div className="w-full">
          {currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'text' ? (
            <QuestionComponent
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentStep + 1}
              onAnswerChange={handleAnswerChange}
              currentAnswer={answers[currentQuestion.id]}
            />
          ) : (
            <ImageQuestionComponent
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentStep + 1}
              onAnswerChange={handleAnswerChange}
              currentAnswer={answers[currentQuestion.id]}
            />
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-brand-cream text-gray-800 flex flex-col items-center justify-center p-4 selection:bg-brand-red selection:text-white">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {currentStep > -1 && status !== 'submitted' && (
           <h1 className="text-3xl font-bold text-brand-red mb-2">Formulário Diagnóstico</h1>
        )}

        <div className="w-full bg-white rounded-lg shadow-2xl p-6 md:p-10 min-h-[600px] flex flex-col justify-between text-gray-800">
          <div className="flex-grow flex items-center justify-center">
            {renderContent()}
          </div>
          {currentStep > -1 && status !== 'submitted' && (
            <div className="mt-8">
              <ProgressBar progress={progress} />
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="px-6 py-2 bg-brand-blue text-white font-semibold hover:brightness-105 active:brightness-110 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <p className="text-sm text-gray-500">{currentStep + 1} / {totalQuestions}</p>
                {currentStep < totalQuestions - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isCurrentAnswerValid}
                    className="px-6 py-2 bg-brand-red text-white hover:brightness-95 active:brightness-90 rounded-md transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isCurrentAnswerValid || status === 'submitting'}
                    className="px-6 py-2 bg-brand-orange text-white hover:brightness-95 active:brightness-90 rounded-md transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? 'Enviando...' : 'Enviar Respostas'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
       <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Escola Builders</p>
      </footer>
    </div>
  );
};

// --- RENDER ---

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