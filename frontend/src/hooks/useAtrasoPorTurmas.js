import { useEffect, useState } from 'react';
import { getAtrasoTurma } from '../api/metricas';

// Busca diasAtraso para cada turma em paralelo. Retorna um mapa
// { [idTurma]: { diasAtraso, carregando, erro } } que a UI pode consultar
// por linha, sem bloquear a exibição da tabela até tudo carregar.
export function useAtrasoPorTurmas(turmas) {
  const [atrasos, setAtrasos] = useState({});

  useEffect(() => {
    if (turmas.length === 0) {
      setAtrasos({});
      return;
    }

    setAtrasos(
      Object.fromEntries(turmas.map((t) => [t.id_turma, { carregando: true }]))
    );

    turmas.forEach((turma) => {
      getAtrasoTurma(turma.id_turma)
        .then((resultado) => {
          setAtrasos((atual) => ({
            ...atual,
            [turma.id_turma]: {
              carregando: false,
              diasAtraso: resultado.diasAtraso,
              dataUltimoLancamento: resultado.dataUltimoLancamento,
            },
          }));
        })
        .catch(() => {
          setAtrasos((atual) => ({
            ...atual,
            [turma.id_turma]: { carregando: false, erro: true },
          }));
        });
    });
  }, [turmas]);

  return atrasos;
}
