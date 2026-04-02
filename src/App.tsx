import { useGameState } from './hooks/useGameState';
import { Header } from './components/layout/Header';
import { StepIndicator } from './components/layout/StepIndicator';
import { GameSetup } from './components/steps/GameSetup';
import { PlayPhase } from './components/steps/PlayPhase';
import { Cashout } from './components/steps/Cashout';
import { Results } from './components/steps/Results';

function App() {
  const { state, dispatch } = useGameState();

  const setStep = (step: 1 | 2 | 3 | 4) => {
    dispatch({ type: 'SET_STEP', payload: { step } });
  };

  const handleReset = () => dispatch({ type: 'RESET_GAME' });

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <GameSetup
            state={state}
            dispatch={dispatch}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <PlayPhase
            state={state}
            dispatch={dispatch}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
            onReset={handleReset}
          />
        );
      case 3:
        return (
          <Cashout
            state={state}
            dispatch={dispatch}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
            onReset={handleReset}
          />
        );
      case 4:
        return (
          <Results
            state={state}
            dispatch={dispatch}
            onBack={() => setStep(3)}
            onNewGame={() => dispatch({ type: 'RESET_GAME' })}
            onReset={handleReset}
          />
        );
    }
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <StepIndicator currentStep={state.currentStep} onStepClick={setStep} />
      <main className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">
        <div key={state.currentStep} className="animate-fade-in">
          {renderStep()}
        </div>
      </main>
    </div>
  );
}

export default App;
