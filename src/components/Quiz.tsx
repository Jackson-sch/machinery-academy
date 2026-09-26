import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
}

interface Props {
  machineTitle: string;
  questions: Question[];
}

export default function Quiz({ machineTitle, questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const isSelected = selectedAnswers[currentQ.id] !== undefined;
  const isQuestionSubmitted = submitted[currentQ.id];

  const handleSelect = (optionIndex: number) => {
    if (isQuestionSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionIndex,
    });
  };

  const handleSubmitQuestion = () => {
    if (!isSelected) return;
    setSubmitted({
      ...submitted,
      [currentQ.id]: true,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      // calculate score
      let correct = 0;
      questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.respuestaCorrecta) {
          correct += 1;
        }
      });
      const pct = (correct / questions.length) * 100;
      if (pct >= 70) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#10b981', '#6366f1'],
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmitted({});
    setIsFinished(false);
  };

  // Score calculation
  let correctCount = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.respuestaCorrecta) {
      correctCount += 1;
    }
  });
  const scorePercent = Math.round((correctCount / questions.length) * 100);
  const isPassed = scorePercent >= 70;

  if (isFinished) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-2xl">
        <div className="inline-flex p-4 rounded-full bg-slate-800 border border-slate-700 mb-4">
          <Award className={`w-12 h-12 ${isPassed ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
        </div>
        <h3 className="text-2xl font-black text-white">
          {isPassed ? '¡Evaluación Aprobada!' : 'Evaluación No Aprobada'}
        </h3>
        <p className="text-sm text-slate-400 mt-2">
          {isPassed
            ? `Has demostrado conocimiento operativo riguroso en ${machineTitle}.`
            : `Necesitas un mínimo de 70% para certificar este módulo. Revisa los conceptos técnicos y vuelve a intentarlo.`}
        </p>

        <div className="my-8 inline-block p-6 rounded-2xl bg-slate-950/80 border border-slate-800 w-full max-w-sm">
          <div className="text-4xl font-extrabold text-amber-400">{scorePercent}%</div>
          <div className="text-xs text-slate-400 mt-1">
            {correctCount} de {questions.length} respuestas correctas
          </div>
          <div className="mt-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPassed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {isPassed ? 'CERTIFICADO APTO' : 'REQUIERE REPASO'}
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <RotateCcw className="w-4 h-4" /> Reintentar Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Validación de Conocimiento
          </span>
        </div>
        <div className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
          Pregunta {currentIndex + 1} de {questions.length}
        </div>
      </div>

      {/* Question title */}
      <h3 className="text-lg md:text-xl font-bold text-white mb-6">
        {currentQ.pregunta}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQ.opciones.map((opcion, idx) => {
          const isChosen = selectedAnswers[currentQ.id] === idx;
          const isCorrect = idx === currentQ.respuestaCorrecta;

          let optionStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300';
          if (isQuestionSubmitted) {
            if (isCorrect) {
              optionStyle = 'bg-emerald-950/30 border-emerald-500 text-emerald-200 font-medium';
            } else if (isChosen && !isCorrect) {
              optionStyle = 'bg-red-950/30 border-red-500 text-red-200';
            } else {
              optionStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
            }
          } else if (isChosen) {
            optionStyle = 'bg-amber-950/20 border-amber-500 text-white shadow-md shadow-amber-500/10';
          }

          return (
            <div
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm">{opcion}</span>
              </div>
              {isQuestionSubmitted && isCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2" />
              )}
              {isQuestionSubmitted && isChosen && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 ml-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isQuestionSubmitted && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            Fundamento Técnico:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentQ.explicacion}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          Selecciona una respuesta y pulsa Validar.
        </div>
        <div>
          {!isQuestionSubmitted ? (
            <button
              onClick={handleSubmitQuestion}
              disabled={!isSelected}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isSelected
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Validar Respuesta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {currentIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Calificación'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
