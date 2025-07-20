import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, TrendingUp } from 'lucide-react';

const Tips: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      title: "Regra dos 50-30-20",
      content: "Destine 50% da renda para necessidades, 30% para desejos e 20% para poupança e investimentos.",
      icon: "💰"
    },
    {
      title: "Emergência Primeiro",
      content: "Tenha uma reserva de emergência equivalente a 3-6 meses de despesas antes de investir.",
      icon: "🚨"
    },
    {
      title: "Controle de Gastos",
      content: "Anote todos os gastos por pelo menos um mês para identificar onde seu dinheiro está indo.",
      icon: "📝"
    },
    {
      title: "Invista Regularmente",
      content: "Mesmo pequenas quantias investidas mensalmente podem crescer significativamente com o tempo.",
      icon: "📈"
    },
    {
      title: "Evite Dívidas no Cartão",
      content: "O cartão de crédito pode ser uma armadilha. Use com moderação e pague sempre a fatura integral.",
      icon: "💳"
    },
    {
      title: "Compare Preços",
      content: "Antes de comprar, compare preços em diferentes lojas e sites. Pequenas economias somam muito.",
      icon: "🔍"
    },
    {
      title: "Automatize Sua Poupança",
      content: "Configure transferências automáticas para sua conta poupança logo após receber o salário.",
      icon: "⚙️"
    },
    {
      title: "Diversifique Investimentos",
      content: "Não coloque todos os ovos na mesma cesta. Diversifique seus investimentos para reduzir riscos.",
      icon: "🎯"
    },
    {
      title: "Revise Gastos Mensais",
      content: "Cancele assinaturas que não usa e renegocie contratos regularmente.",
      icon: "🔄"
    },
    {
      title: "Eduque-se Financeiramente",
      content: "Invista tempo em aprender sobre finanças pessoais e investimentos.",
      icon: "📚"
    },
    {
      title: "Método dos Envelopes",
      content: "Separe dinheiro em categorias específicas (alimentação, lazer, etc.) e não ultrapasse o limite de cada envelope.",
      icon: "✉️"
    },
    {
      title: "Compre à Vista",
      content: "Sempre que possível, compre à vista para conseguir descontos e evitar juros desnecessários.",
      icon: "💵"
    },
    {
      title: "Planeje Grandes Compras",
      content: "Para compras acima de R$ 500, planeje com antecedência e pesquise por pelo menos uma semana.",
      icon: "🛍️"
    },
    {
      title: "Renda Extra",
      content: "Considere desenvolver uma fonte de renda extra para acelerar seus objetivos financeiros.",
      icon: "💼"
    },
    {
      title: "Monitore Seu Score",
      content: "Mantenha seu CPF limpo e monitore seu score de crédito regularmente para melhores condições.",
      icon: "📊"
    }
  ];

  const motivationalQuotes = [
    "O sucesso financeiro não é sobre ganhar muito, mas sobre gastar menos do que ganha.",
    "Cada centavo poupado é um passo em direção à liberdade financeira.",
    "Invista em você mesmo. É o melhor investimento que você pode fazer.",
    "A disciplina financeira de hoje é a liberdade de amanhã.",
    "Pequenas decisões financeiras consistentes levam a grandes resultados.",
    "O tempo é seu maior aliado quando se trata de investimentos.",
    "Controle seu dinheiro ou ele controlará você.",
    "A riqueza não está no que você ganha, mas no que você guarda.",
    "Comece onde você está, use o que você tem, faça o que você pode.",
    "A melhor hora para investir foi há 20 anos. A segunda melhor hora é agora.",
    "Não é o quanto você ganha, mas o quanto você economiza que determina sua riqueza.",
    "Dinheiro é um servo excelente, mas um mestre terrível.",
    "A paciência é a chave para o sucesso financeiro a longo prazo.",
    "Quem não controla seus gastos, será controlado por eles.",
    "Investir é plantar hoje para colher amanhã.",
    "A educação financeira é o melhor investimento que você pode fazer em si mesmo.",
    "Pequenos gastos desnecessários podem se tornar grandes problemas financeiros.",
    "O primeiro passo para a riqueza é gastar menos do que você ganha.",
    "Dinheiro guardado é dinheiro multiplicado pelo tempo.",
    "A liberdade financeira começa com uma decisão: viver abaixo das suas possibilidades."
  ];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <blockquote className="text-white text-lg font-medium italic">
          "{motivationalQuotes[currentQuote]}"
        </blockquote>
        <div className="flex justify-center mt-4 space-x-1">
          {motivationalQuotes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentQuote ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Lightbulb className="w-8 h-8 mr-3 text-yellow-500" />
            Dicas de Economia
          </h2>
          <button
            onClick={nextTip}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Próxima Dica</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{tips[currentTip].icon}</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {tips[currentTip].title}
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {tips[currentTip].content}
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-8">
          {tips.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentTip 
                  ? 'bg-green-500' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Quick Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
              💡 Dica Rápida
            </h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Use a regra dos 30 dias: antes de fazer uma compra grande, espere 30 dias. 
              Muitas vezes você perceberá que não precisava realmente daquele item.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">
              🎯 Meta do Mês
            </h4>
            <p className="text-purple-800 dark:text-purple-200 text-sm">
              Estabeleça uma meta financeira específica para este mês, como economizar 
              R$ 200 ou reduzir gastos com delivery em 50%.
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
            <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-3">
              📊 Análise Mensal
            </h4>
            <p className="text-orange-800 dark:text-orange-200 text-sm">
              Todo final de mês, revise seus gastos e identifique padrões. 
              Onde você gastou mais? O que pode ser otimizado?
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">
              🏆 Recompense-se
            </h4>
            <p className="text-green-800 dark:text-green-200 text-sm">
              Quando atingir uma meta financeira, celebre! Mas faça isso de forma 
              consciente e dentro do seu orçamento.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-3">
              ⏰ Dica do Dia
            </h4>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Dedique 10 minutos por dia para revisar seus gastos. Essa pequena ação 
              pode gerar grandes economias ao longo do tempo.
            </p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3">
              🎓 Aprenda Mais
            </h4>
            <p className="text-indigo-800 dark:text-indigo-200 text-sm">
              Leia pelo menos um artigo sobre finanças por semana. O conhecimento 
              é seu melhor investimento para o futuro financeiro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;