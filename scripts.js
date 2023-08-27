const asciiArt = `
**********                        **                    **
/////**///                        //                    /**
    /**  *****  ****** **********  ** *******   ******  /**
    /** **///**//**//*//**//**//**/**//**///** //////** /**
    /**/******* /** /  /** /** /**/** /**  /**  ******* /**
    /**/**////  /**    /** /** /**/** /**  /** **////** /**
    /**//******/***    *** /** /**/** ***  /**//***********
    //  ////// ///    ///  //  // // ///   //  /////////// 

        ___               ___   ___   ___         ___  
         | |  /  /       |   |     | |     |   |     | 
         +-    +         |-+-   -+-  |-+-  |   |  -+-  
         | |  /          |     |     |     |   | |     
        ---                     ---         ---   ---  
                                            
`; 

const welcomeMessage = "Bem-vindo ao terminal Simulador v.3.0.1!\nDigite 'help' ou '?' para obter ajuda.";

document.getElementById('ascii-logo').innerText = asciiArt;
document.getElementById('welcome-message').innerText = welcomeMessage;

let commandHistory = [];
let historyIndex = -1;

// Carregar histórico quando o script é iniciado
if (localStorage.getItem('commandHistory')) {
    commandHistory = JSON.parse(localStorage.getItem('commandHistory'));
}

document.getElementById('input').addEventListener('keydown', function(e) {
    switch (e.key) {
        case 'Enter':
            processCommand(e.target.value);
            // Adicionar o comando ao histórico e redefinir o índice
            commandHistory.push(e.target.value);
            localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
            historyIndex = -1;
            e.target.value = '';  // Limpar o campo de entrada
            break;
        case 'ArrowUp':
            // Se o índice do histórico não estiver no início, vá para o comando anterior
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                e.target.value = commandHistory[commandHistory.length - 1 - historyIndex];
            }
            break;
        case 'ArrowDown':
            // Se o índice do histórico não estiver no final, vá para o próximo comando
            if (historyIndex > 0) {
                historyIndex--;
                e.target.value = commandHistory[commandHistory.length - 1 - historyIndex];
            } else {
                e.target.value = '';
            }
            break;
    }
});


function typeEffect(element, message, index = 0, interval = 10) {
    if (index < message.length) {
        element.textContent += message[index];
        setTimeout(() => typeEffect(element, message, index + 1, interval), interval);
    }
}

function safeEval(expression) {
    try {
        // Substitua ^ por ** para exponenciação
        expression = expression.replace(/\^/g, '**');
        
        // Substitua sqrt() por Math.sqrt() para raiz quadrada
        expression = expression.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');

        if (expression.startsWith("quad(")) {
            // Extrair os coeficientes a, b e c
            const [a, b, c] = expression.slice(5, -1).split(',').map(num => parseFloat(num));
            return resolveQuadratic(a, b, c);
        }
        
        // Isto cria uma nova função com a expressão e a retorna
        let func = new Function('return ' + expression);
        return func();
    } catch (error) {
        return 'Expressão inválida.';
    }
}





function processCommand(command) {
    let outputMessage = '';
    let args = command.split(' ');
    let mainCommand = args.shift();



    // Defina os arrays aqui

    // Defina sua matriz de fórmulas aqui
    const formulas = [          
    {"nome": "Operating Profit Margin", "formula": "Lucro operacional / Receita total", "descricao": "Mede a eficiência operacional"},
    {"nome": "Return on Sales (ROS)", "formula": "Lucro líquido / Receita de vendas", "descricao": "Lucro por venda"},
    {"nome": "Return on Capital Employed (ROCE)", "formula": "EBIT / (Total de ativos - Passivos circulantes)", "descricao": "Lucro por capital utilizado"},
    {"nome": "Debt Ratio", "formula": "Dívida total / Ativos totais", "descricao": "Parte da dívida no financiamento de ativos"},
    {"nome": "Asset Turnover", "formula": "Receitas / Ativos médios", "descricao": "Eficiência do uso de ativos"},
    {"nome": "Book Value per Share", "formula": "Patrimônio líquido / Total de ações", "descricao": "Valor contábil por ação"},
    {"nome": "Interest Coverage", "formula": "EBIT / Despesas de juros", "descricao": "Habilidade de pagar juros"},
    {"nome": "Accounts Receivable Turnover", "formula": "Vendas a crédito / Contas a receber médias", "descricao": "Eficiência na cobrança de crédito"},
    {"nome": "Days Sales Outstanding", "formula": "365 / Recebíveis", "descricao": "Tempo médio de recebimento de vendas"},
    {"nome": "Accounts Payable Turnover", "formula": "COGS / Contas a pagar médias", "descricao": "Eficiência no pagamento a fornecedores"},
    {"nome": "Days Payable Outstanding", "formula": "365 / Payables Turnover", "descricao": "Tempo médio de pagamento a fornecedores"},
    {"nome": "Cash Conversion Cycle", "formula": "Dias de estoque + Dias de recebíveis - Dias de contas a pagar", "descricao": "Tempo para converter investimentos em dinheiro"},
    {"nome": "Fixed Asset Turnover", "formula": "Vendas / Ativos fixos médios", "descricao": "Eficiência do uso de ativos fixos"},
    {"nome": "Equity Turnover", "formula": "Vendas / Patrimônio líquido médio", "descricao": "Eficiência do uso do patrimônio"},
    {"nome": "Net Working Capital", "formula": "Ativos circulantes - Passivos circulantes", "descricao": "Liquidez de curto prazo"},
    {"nome": "Debt to Income", "formula": "Dívida total / Renda total", "descricao": "Parte da renda que vai para a dívida"},
    {"nome": "Earnings Yield", "formula": "EPS / Preço da ação", "descricao": "Retorno de investimento"},
    {"nome": "Free Cash Flow per Share", "formula": "Free Cash Flow / Total de ações", "descricao": "Dinheiro disponível por ação"},
    {"nome": "Operating Cash Flow Ratio", "formula": "Cash Flow Operacional / Passivos circulantes", "descricao": "Habilidade de pagar passivos"},
    {"nome": "Price to Sales", "formula": "Preço da ação / Receita por ação", "descricao": "Valor da empresa em relação à receita"},
    {"nome": "Price to Book", "formula": "Preço da ação / Valor contábil por ação", "descricao": "Valor de mercado em relação ao valor contábil"},
    {"nome": "Payout Ratio", "formula": "Dividendos / Lucro líquido", "descricao": "Parte do lucro pago como dividendo"},
    {"nome": "Current Cash Debt Coverage", "formula": "Cash Flow Operacional / Dívida total", "descricao": "Habilidade de pagar dívida com o fluxo de caixa"},
    {"nome": "Cash Debt Coverage", "formula": "Cash Flow Operacional / Dívida total", "descricao": "Habilidade de pagar dívida com o fluxo de caixa"},
    {"nome": "Total Debt Ratio", "formula": "(Ativos totais - Patrimônio líquido) / Ativos totais", "descricao": "Parte do financiamento que é dívida"},
    {"nome": "Times Interest Earned", "formula": "Lucro antes dos juros e impostos / Despesas de juros", "descricao": "Habilidade de cumprir obrigações de juros"},
    {"nome": "Cash Ratio", "formula": "(Caixa + Equivalentes de caixa) / Passivos circulantes", "descricao": "Liquidez imediata"},
    {"nome": "Operating Cycle", "formula": "Dias de estoque + Dias de recebíveis", "descricao": "Tempo para vender e receber pagamento"},
    {"nome": "Return on Total Assets", "formula": "Lucro líquido / Ativos totais", "descricao": "Eficiência do uso de ativos"},
    {"nome": "Dividend Yield", "formula": "Dividendos por ação / Preço da ação", "descricao": "Retorno de dividendos"},
    {"nome": "Economic Value Added", "formula": "NOPAT - (Capital investido * WACC)", "descricao": "Valor econômico criado"},
    {"nome": "Economic Profit", "formula": "NOPAT - (Capital investido * Custo de capital)", "descricao": "Lucro econômico"},
    {"nome": "Cash Return on Capital Invested", "formula": "Cash Flow Operacional / Capital investido", "descricao": "Retorno do fluxo de caixa para capital investido"},
];  

    // Defina sua matriz de citações aqui
    const quotes = [         
    "“Os fins justificam os meios.” - Maquiavel",
    "“A vida, se bem vivida, é longa.” - Sêneca",
    "“Só sei que nada sei.” - Sócrates",
    "“A medida do amor é amar sem medida.” - Platão",
    "“A excelência não é um feito, é um hábito.” - Aristóteles",
    "“Penso, logo existo.” - Descartes",
    "“O homem não é nada além daquilo que a educação faz dele.” - Kant",
    "“O que não provoca minha morte faz com que eu fique mais forte.” - Nietzsche",
    "“Não rir, não lamentar, nem odiar, mas compreender.” - Spinoza",
    "“Onde quer que você vá, vá com todo o coração.” - Confúcio",
    "“Nada é suficiente para quem o suficiente é pouco.” - Epicuro",
    "“A vida só pode ser compreendida olhando-se para trás; mas só pode ser vivida olhando-se para a frente.” - Kierkegaard",
    "“A verdade é o todo.” - Hegel",
    "“Os filósofos até agora apenas interpretaram o mundo de várias maneiras, o que importa é modificá-lo.” - Marx",
    "“Não sou eu quem me pergunta, sou eu quem responde.” - Foucault",
    "“O homem nasce livre, e por toda a parte encontra-se a ferros.” - Rousseau",
    "“A maior coisa do mundo é saber ser auto-suficiente.” - Montaigne",
    "“A educação faz tudo.” - Locke",
    "“A beleza das coisas existe no espírito de quem as contempla.” - Hume",
    "“O homem é o lobo do homem.” - Hobbes",
    "“O tempo que você gosta de perder não é tempo perdido.” - Bertrand Russell",
    "“Posso não concordar com uma palavra que você diz, mas defenderei até a morte o seu direito de dizê-la.” - Voltaire",
    "“Não se nasce mulher, torna-se mulher.” - Simone de Beauvoir",
    "“A existência precede a essência.” - Jean-Paul Sartre",
    "“No meio do inverno, aprendi finalmente que havia em mim um verão invencível.” - Albert Camus",
    "“Por que há ser ao invés de nada?” - Martin Heidegger",
    "“A liberdade é a reconhecimento da necessidade.” - Friedrich Engels",
    "“Não se pode entrar duas vezes no mesmo rio.” - Heráclito",
    "“Tenho apenas o sol e a lua como companhia constante.” - Diógenes",
    "“Não é da benevolência do açougueiro, do cervejeiro e do padeiro que esperamos o nosso jantar, mas da consideração que eles têm pelos próprios interesses.” - Adam Smith",
    "“Evitar a ociosidade é ordenar a vida de tal maneira que o ócio não se torne um fardo.” - Thomas Aquino",
    "“O coração tem razões que a própria razão desconhece.” - Pascal",
    "“Melhor ser Sócrates insatisfeito do que um tolo satisfeito.” - John Stuart Mill",
    "“Da indústria dos livros depende a indústria do universo.” - Diderot",
    "“A história do mundo é o progresso na consciência da liberdade.” - Georg Wilhelm Friedrich Hegel",
    "“A vida oscila como um pêndulo, para frente e para trás, entre a dor e o tédio.” - Arthur Schopenhauer",
    "“Os limites da minha linguagem são os limites do meu mundo.” - Ludwig Wittgenstein",
    "“A razão é, e só deve ser, a escrava das paixões.” - David Hume",
    "“Ouse saber.” - Immanuel Kant",
    "“Aquele que tem um porquê para viver pode suportar quase qualquer como.” - Friedrich Nietzsche",
 ];    

    // Defina sua matriz de animes aqui
    const animes = [          
    {"nome": "Naruto", "views": 300000000},
    {"nome": "One Piece", "views": 250000000},
    {"nome": "Attack on Titan", "views": 200000000},
    {"nome": "Bleach", "views": 150000000},
    {"nome": "Dragon Ball", "views": 350000000},
    {"nome": "Death Note", "views": 180000000},
    {"nome": "Sword Art Online", "views": 140000000},
    {"nome": "Fullmetal Alchemist: Brotherhood", "views": 130000000},
    {"nome": "Hunter x Hunter", "views": 120000000},
    {"nome": "My Hero Academia", "views": 110000000},
    {"nome": "Fairy Tail", "views": 105000000},
    {"nome": "Tokyo Ghoul", "views": 100000000},
    {"nome": "Cowboy Bebop", "views": 90000000},
    {"nome": "Jojo's Bizarre Adventure", "views": 80000000},
    {"nome": "Demon Slayer: Kimetsu no Yaiba", "views": 200000000},
    {"nome": "Code Geass", "views": 70000000},
    {"nome": "Gintama", "views": 60000000},
    {"nome": "Haikyuu", "views": 120000000},
    {"nome": "Naruto: Shippuden", "views": 230000000},
    {"nome": "Pokémon", "views": 300000000},
    {"nome": "One Punch Man", "views": 190000000},
    {"nome": "Neon Genesis Evangelion", "views": 65000000},
    {"nome": "Psycho-Pass", "views": 75000000},
    {"nome": "Yu-Gi-Oh", "views": 130000000},
    {"nome": "Steins;Gate", "views": 70000000},
    {"nome": "Inuyasha", "views": 100000000},
    {"nome": "Doraemon", "views": 180000000},
    {"nome": "Attack on Titan: Final Season", "views": 150000000},
    {"nome": "Jujutsu Kaisen", "views": 140000000},
    {"nome": "Mobile Suit Gundam", "views": 80000000},
    {"nome": "Dragon Ball Z", "views": 290000000},
    {"nome": "Ghost in the Shell", "views": 65000000},
    {"nome": "Sailor Moon", "views": 120000000},
    {"nome": "Nanatsu no Taizai", "views": 130000000},
    {"nome": "Detective Conan", "views": 200000000},
    {"nome": "Digimon", "views": 110000000},
    {"nome": "Re:Zero", "views": 85000000},
    {"nome": "Your Lie in April", "views": 75000000},
    {"nome": "Boku no Pico", "views": 60000000},
    {"nome": "Black Clover", "views": 110000000},
    {"nome": "Shingeki no Kyojin", "views": 180000000},
    {"nome": "Akame ga Kill!", "views": 70000000},
    {"nome": "Boruto: Naruto Next Generations", "views": 130000000},
    {"nome": "No Game No Life", "views": 90000000},
    {"nome": "Angel Beats!", "views": 65000000},
    {"nome": "Tokyo Revengers", "views": 120000000},
    {"nome": "Clannad", "views": 50000000},
    {"nome": "High School DxD", "views": 70000000},
    {"nome": "Berserk", "views": 80000000},
    {"nome": "Elfen Lied", "views": 60000000},
];    

    // Defina sua matriz de erros aqui
    const erros = [            
    "Não comentar o código.",
    "Ignorar os princípios do SOLID.",
    "Não testar o código adequadamente.",
    "Não tratar erros e exceções.",
    "Uso excessivo de variáveis globais.",
    "Não seguir convenções de nomenclatura.",
    "Escrever código muito complexo e difícil de entender.",
    "Não usar controle de versão.",
    "Não reutilizar o código quando possível.",
    "Esquecer de otimizar o código para melhor desempenho.",
    "Não separar o código em funções ou métodos pequenos e claros.",
    "Não validar ou desinfetar a entrada do usuário.",
    "Não seguir os princípios de design responsivo em desenvolvimento web.",
    "Ignorar a importância do UX/UI em aplicativos e sites.",
    "Esquecer de liberar recursos após o uso (por exemplo, fechar conexões de banco de dados).",
    "Codificar sem um plano ou estrutura clara em mente.",
    "Não entender completamente a linguagem de programação que está sendo usada.",
    "Uso excessivo de recursão, levando a desempenho ruim e possível estouro de pilha.",
    "Assumir que o código sempre funcionará em todos os casos (não considerar casos extremos).",
    "Não aprender sobre novas ferramentas, tecnologias e melhores práticas.",
    "Não realizar revisões de código.",
    "Escrever funções ou métodos longos, em vez de mantê-los curtos e focados.",
    "Esquecer de fazer backups regulares do código.",
    "Esquecer de usar ou atualizar documentação.",
    "Não usar uma estrutura ou biblioteca quando isso poderia economizar tempo e esforço.",
    "Ignorar a segurança e deixar o código vulnerável a ataques.",
    "Não se comunicar efetivamente com a equipe ou com o cliente.",
    "Ignorar a importância de um bom design de interface do usuário.",
    "Esquecer de verificar se o código é compatível com diferentes plataformas ou navegadores.",
    "Uso excessivo de bibliotecas e frameworks externos, o que pode tornar o código lento e pesado.",
    "Ignorar a importância do SEO em desenvolvimento web.",
    "Não se adaptar a novas mudanças ou requisitos do projeto.",
    "Esquecer de lidar com caracteres especiais ou diferentes codificações de caracteres.",
    "Ignorar a importância de testes unitários e testes de integração.",
    "Esquecer de atualizar as dependências do projeto.",
    "Não refatorar o código regularmente.",
    "Esquecer de usar um ambiente de desenvolvimento isolado (como um contêiner Docker).",
    "Hardcoding de valores que podem mudar no futuro.",
    "Não acompanhar as alterações na especificação do projeto.",
    "Não escrever testes para o código.",
    "Não usar constantes para valores que não mudam.",
    "Não considerar a experiência do usuário ao projetar interfaces de usuário.",
    "Esquecer de realizar testes de carga e estresse em aplicativos web.",
    "Ignorar as mensagens de erro ou avisos do compilador.",
    "Não usar um debugger ao tentar resolver problemas de código.",
    "Assumir que a entrada do usuário sempre será o que você espera.",
    "Não seguir os princípios DRY (Don't Repeat Yourself).",
    "Não seguir os princípios KISS (Keep It Simple, Stupid).",
    "Esquecer de realizar testes de regressão ao modificar o código.",
    "Escrever código sem considerar a acessibilidade para todos os usuários."
];     

const riddle = [
    "Quanto mais você tira, maior fica. O que é?", 
    "O que é que anda com os pés na cabeça?", 
    "O que vem antes de domingo e depois de sábado, mas não está na semana?",
    "O que é que quanto mais seca, mais molhada fica?"
    // ... [Adicione mais enigmas conforme desejado]
];

function getCurrentDateByCalendar() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return {
        gregorian: `${day}/${month}/${year} (calendário gregoriano)`,
        chinese: `${day}/${month}/${year + 2000} (calendário chinês)`,
        hebrew: `${day}/${month}/${year + 3760} (calendário hebraico)`,
        islamic: `${day}/${month}/${year + 622} (calendário islâmico)`
        // Adicione outros calendários conforme necessário
    };
}

function getCurrentTimeByTimezone() {
    const date = new Date();
    const timezones = {
        'Europe/Moscow': { country: "Rússia", utc: "UTC+3" },
        'America/Sao_Paulo': { country: "Brasil", utc: "UTC-3" },
        'Asia/Tokyo': { country: "Japão", utc: "UTC+9" },
        'America/New_York': { country: "EUA", utc: "UTC-5" }
        // Adicione outros fusos horários conforme necessário
    };

    let timeByZone = {};
    for (let zone in timezones) {
        const options = {
            timeZone: zone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        timeByZone[zone] = {
            time: new Intl.DateTimeFormat('default', options).format(date),
            country: timezones[zone].country,
            utc: timezones[zone].utc
        };
    }
    return timeByZone;
}

if (command.startsWith('.calc')) {
    if (command.trim() === '.calc') {
        outputMessage = ".calc requer uma expressão. Por exemplo: .calc 1+1";
    } else {
        const expression = command.slice(6).trim(); // Pega tudo após '.calc'
        outputMessage = safeEval(expression).toString();
    }
} else {
    switch (command) {
    case '.filosofia':
        let randomQuoteIndex = Math.floor(Math.random() * quotes.length);
        outputMessage = quotes[randomQuoteIndex];
        break;
    case '.date':
        const dates = getCurrentDateByCalendar();
        outputMessage = "Datas em diferentes calendários:\n";
        for (let cal in dates) {
            outputMessage += `${cal}: ${dates[cal]}\n`;
        }
        break;
    case '.time':
        const times = getCurrentTimeByTimezone();
        outputMessage = "Horários em diferentes fusos:\n";
        for (let zone in times) {
            outputMessage += `${times[zone].country} (${times[zone].utc}): ${times[zone].time}\n`;
        }
        break;
    case '.anime':
        let randomAnimeIndex = Math.floor(Math.random() * animes.length);
        outputMessage = animes[randomAnimeIndex].nome + " - " + animes[randomAnimeIndex].views + " views";
        break;
    case '.prog':
        let randomErrorIndex = Math.floor(Math.random() * erros.length);
        outputMessage = erros[randomErrorIndex];
        break;
    case '.riddle':
        let randomRiddleIndex = Math.floor(Math.random() * erros.length);
        outputMessage = riddle[randomRiddleIndex];
        break;
    case '.finance':
        let randomFormulaIndex = Math.floor(Math.random() * formulas.length);
        outputMessage = formulas[randomFormulaIndex].nome + ": " + formulas[randomFormulaIndex].formula + " - " + formulas[randomFormulaIndex].descricao;
        break;
        case '.story':
            outputMessage = "A luz fraca do terminal de computador lançava um brilho espectral sobre o meu rosto. O silêncio do meu abrigo, sepultado profundamente no subsolo, era apenas quebrado pelo zumbido suave das máquinas e pelo som ritmado das minhas teclas. Eu era o hacker, a última linha de defesa contra o apocalipse. A superfície da Terra era um deserto inóspito, transformado em um mundo selvagem e mortífero por uma série de desastres ambientais, conflitos e pandemias que tinham dizimado a humanidade. Nossas cidades, antes símbolos orgulhosos do nosso engenho e ambição, agora eram apenas ruínas enferrujadas, lar de criaturas mutantes e sobreviventes desesperados. Mas abaixo da superfície, enterrado em segurança contra o caos acima, havia um refúgio. Este era o meu mundo, uma rede de túneis e câmaras, abrigando a última esperança da humanidade: o terminal. O terminal era a nossa Arca de Noé digital, uma compilação gigantesca de todo o conhecimento humano. Dados históricos, obras de arte, música, ciência, literatura, religião, filosofia, tecnologia, tudo estava aqui, armazenado em uma complexa rede de servidores e supercomputadores. Eu era o guardião deste tesouro, o último estudioso deste arquivo da civilização humana. Minha tarefa? Coletar, aprender e, mais importante, preservar. A cada dia, eu explorava um novo aspecto da rica tapeçaria da história humana, descobrindo camadas e camadas de conhecimento. Por vezes, eram relatos de momentos de grandeza e triunfo, histórias de inovação e exploração, de amizade e amor. Em outros momentos, eram narrativas mais sombrias, lições sobre as profundezas a que a humanidade poderia cair, lembretes da ganância, da crueldade e da ignorância que haviam nos levado a este ponto. Mas cada fragmento de informação era valioso. Cada linha de código, cada byte de dados era uma peça do quebra-cabeça, uma contribuição para o retrato completo da humanidade. E cada peça que eu adicionava à minha compreensão me deixava um passo mais perto de cumprir a minha missão: a preservação do legado humano para as gerações futuras. No final do dia, enquanto eu assistia ao pôr do sol virtual projetado na parede da minha câmara, eu sabia que cada dia que passava era uma vitória. Uma vitória contra o esquecimento, contra a extinção. Eu estava mantendo viva a chama do conhecimento humano, um ciber-herói solitário no abismo do apocalipse. Eu era a última esperança da humanidade. Aperte qualquer tecla.";
            break;
                case 'help':
                    case '?':
                        if (command.split(' ')[1] === '.calc') {  // Verifique se a segunda palavra é .calc
                            outputMessage = 
                        "Introdução: A função .calc permite calcular expressões matemáticas.\n\n" +
                        "Operações suportadas:\n" +
                        "- Adição: 1 + 1\n" +
                        "- Subtração: 5 - 3\n" +
                        "- Multiplicação: 3 * 3\n" +
                        "- Divisão: 8 / 2\n" +
                        "- Exponenciação: 2 ^ 3 (representa 2 ao cubo)\n" +
                        "- Raiz Quadrada: sqrt(9) (retorna 3)\n" +
                        "- Equação Quadrática: quad(a,b,c) (retorna as raízes da equação ax^2 + bx + c = 0)\n\n" +
                        "Exemplos:\n" +
                        "- .calc 1 + 1\n" +
                        "- .calc 5 - 3\n" +
                        "- .calc 3 * 3\n" +
                        "- .calc 8 / 2\n" +
                        "- .calc 2 ^ 3\n" +
                        "- .calc sqrt(9)\n" +
                        "- .calc quad(1,-3,2)"
    
            } else {
                outputMessage = 
                    ".calc <expressão> - Calcula uma expressão matemática.\n" +
                    ".filosofia - Exibe uma citação filosófica aleatória.\n" +
                    ".anime - Exibe informações sobre um anime aleatório.\n" +
                    ".prog - Exibe um erro comum de programação.\n" +
                    ".finance - Exibe uma fórmula financeira aleatória e sua descrição.\n" +
                    ".date - Mostra a data atual em diferentes calendários (Gregoriano, Chinês, Hebraico, Islâmico).\n" +
                    ".time - Mostra o horário atual em diferentes fusos (Rússia, Brasil, Japão, EUA).\n" +
                    ".riddle - Mostra um enigma aleatório.\n" +
                    ".story - Exibe a historia\n"
                
            }
            break;
        
        default:
            outputMessage = 'Comando desconhecido.';
            break;
    }
}
    
    // Criar um contêiner para a linha de comando
    const commandLineDiv = document.createElement('div');
    commandLineDiv.innerText = 'root@servidor % ' + command;  // Adicionar o prompt ao comando do usuário
    document.getElementById('output').appendChild(commandLineDiv);


    // Criar um contêiner para a saída
    const outputDiv = document.createElement('div');
    document.getElementById('output').appendChild(outputDiv);

    typeEffect(outputDiv, outputMessage);  // Aqui estamos chamando a função typeEffect para "digitar" a saída

    window.onload = function() {
        document.getElementById('input').focus();
    }
}
