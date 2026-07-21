import { useEffect, useState } from 'react';
import { getVagas, setVagas as salvarVagas } from '../api/vagas';

const VAGAS_MIN = 0;
const VAGAS_MAX = 25;

// Mapa { [idTurma]: vagas } buscado uma única vez ao montar (o arquivo local
// de vagas não é escopado por filtro, ao contrário da tabela de turmas).
// `vagasEmEdicao` guarda o rascunho de digitação de cada turma, separado do
// valor confirmado, para permitir rollback em caso de erro ao salvar.
export function useVagas() {
  const [vagas, setVagas] = useState({});
  const [vagasEmEdicao, setVagasEmEdicao] = useState({});

  useEffect(() => {
    getVagas()
      .then((mapa) => setVagas(mapa))
      .catch(() => setVagas({}));
  }, []);

  function handleVagasChange(idTurma, valorTexto) {
    setVagasEmEdicao((atual) => ({ ...atual, [idTurma]: valorTexto }));
  }

  async function handleVagasSalvar(idTurma) {
    const valorTexto = vagasEmEdicao[idTurma];
    if (valorTexto === undefined) return;

    const valorAnterior = vagas[idTurma] ?? 0;
    const valorNumerico = Number(valorTexto);

    if (
      valorTexto === '' ||
      !Number.isInteger(valorNumerico) ||
      valorNumerico < VAGAS_MIN ||
      valorNumerico > VAGAS_MAX
    ) {
      setVagasEmEdicao((atual) => {
        const { [idTurma]: _descartado, ...resto } = atual;
        return resto;
      });
      return;
    }

    setVagas((atual) => ({ ...atual, [idTurma]: valorNumerico }));
    setVagasEmEdicao((atual) => {
      const { [idTurma]: _descartado, ...resto } = atual;
      return resto;
    });

    try {
      await salvarVagas(idTurma, valorNumerico);
    } catch {
      setVagas((atual) => ({ ...atual, [idTurma]: valorAnterior }));
    }
  }

  return { vagas, vagasEmEdicao, handleVagasChange, handleVagasSalvar };
}
