import React, { useState } from 'react';
import Header from '../components/Header/Header';
import SubHeader from '../components/SubHeader/SubHeader';
import Container from '../components/Container/Container';
import FormularioInicial from '../components/NovaSolicitacao/FormularioInicial';
import FormularioRota from '../components/NovaSolicitacao/FormularioRota';
import ConfirmacaoFinal from '../components/NovaSolicitacao/ConfirmacaoFinal';
import '../styles/NovaSolicitacao.css';
import { useAuth } from '../contexts/AuthContext';

const NovaSolicitacao = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [dadosSolicitacao, setDadosSolicitacao] = useState({});
  const [pontosRota, setPontosRota] = useState([]);

  const handleAvancar = (dados) => {
    setDadosSolicitacao({ ...dadosSolicitacao, ...dados });
    setStep(step + 1);
  };

  const handleVoltar = () => {
    if (step == 1) {
      window.history.back();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <>
      <Header />
      <SubHeader userName={user.nome} onBack={handleVoltar} />
      <Container>
        {step === 1 && (
          <FormularioInicial dados={dadosSolicitacao} onNext={handleAvancar} />
        )}
        {step === 2 && (
          <FormularioRota
            pontos={pontosRota}
            setPontos={setPontosRota}
            setStep={setStep}
            dadosSolicitacao={dadosSolicitacao}
            onBack={handleVoltar}
          />
        )}
        {step === 3 && (
          <ConfirmacaoFinal
            dados={dadosSolicitacao}
            pontos={pontosRota}
            onBack={handleVoltar}
          />
        )}
      </Container>
    </>
  );
};

export default NovaSolicitacao;
