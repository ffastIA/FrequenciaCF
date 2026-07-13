import { useEffect, useState } from 'react';
import { getFaltas } from '../api/metricas';

// Busca quantidadeFaltas/percentualFaltas para cada aluno em paralelo,
// retornando um mapa { [idAluno]: { carregando, quantidadeFaltas, percentualFaltas, erro } }.
export function useFaltasPorAlunos(idTurma, alunos) {
  const [faltas, setFaltas] = useState({});

  useEffect(() => {
    if (!idTurma || alunos.length === 0) {
      setFaltas({});
      return;
    }

    setFaltas(
      Object.fromEntries(alunos.map((a) => [a.id_aluno, { carregando: true }]))
    );

    alunos.forEach((aluno) => {
      getFaltas(idTurma, aluno.id_aluno)
        .then((resultado) => {
          setFaltas((atual) => ({
            ...atual,
            [aluno.id_aluno]: {
              carregando: false,
              quantidadeFaltas: resultado.quantidadeFaltas,
              percentualFaltas: resultado.percentualFaltas,
            },
          }));
        })
        .catch(() => {
          setFaltas((atual) => ({
            ...atual,
            [aluno.id_aluno]: { carregando: false, erro: true },
          }));
        });
    });
  }, [idTurma, alunos]);

  return faltas;
}
