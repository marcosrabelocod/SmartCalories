
import React, { useState } from 'react';
import { Cpu, ChevronUp, ChevronDown, Zap, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useTokens } from '../IaFunctions/TokenContext';
import './TokenCounter.css';

const TokenCounter: React.FC = () => {
  const { tokens, resetTokens } = useTokens();
  const [isMinimized, setIsMinimized] = useState(true);

  const totalSum = tokens.totalInput + tokens.totalOutput;

  if (totalSum === 0 && isMinimized) return null;

  return (
    <div className={`token-counter-container ${isMinimized ? 'minimized' : 'expanded'}`}>
      <div className="token-header" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="token-title">
          <Cpu size={14} className="text-brand-accent" />
          <span>IA Tokens</span>
        </div>
        <button className="minimize-toggle">
          {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {!isMinimized && (
        <div className="token-body animate-fade-in">
          <div className="token-section-title">Última Chamada</div>
          <div className="token-stat-row">
            <div className="token-stat-mini">
              <ArrowDownLeft size={10} className="text-brand-primary" />
              <span>{tokens.lastInput}</span>
            </div>
            <div className="token-stat-mini">
              <ArrowUpRight size={10} className="text-brand-success" />
              <span>{tokens.lastOutput}</span>
            </div>
          </div>

          <div className="token-divider"></div>

          <div className="token-section-title">Total Acumulado</div>
          <div className="token-stat">
            <span className="stat-label">Entrada:</span>
            <span className="stat-value text-brand-primary">{tokens.totalInput}</span>
          </div>
          <div className="token-stat">
            <span className="stat-label">Saída:</span>
            <span className="stat-value text-brand-success">{tokens.totalOutput}</span>
          </div>

          <div className="token-footer">
            <button onClick={resetTokens} className="reset-token-btn">Zerar</button>
            <div className="token-badge">
                <Zap size={10} fill="currentColor" />
                <span>Gemini 2.5</span>
            </div>
          </div>
        </div>
      )}

      {isMinimized && totalSum > 0 && (
        <div className="minimized-bubble">
           {totalSum > 1000 ? `${(totalSum / 1000).toFixed(1)}k` : totalSum}
        </div>
      )}
    </div>
  );
};

export default TokenCounter;
