const fs = require('fs/promises');
const path = require('path');

const ARQUIVO_VAGAS = path.join(__dirname, '..', 'data', 'vagas.json');

// Serializa as escritas no arquivo dentro do processo, para que duas
// atualizações concorrentes (turmas diferentes) nunca uma sobrescreva o
// efeito da outra por causa de uma leitura desatualizada.
let filaDeEscrita = Promise.resolve();

class VagasService {
  async getAll() {
    const mapa = await this._lerArquivo();
    const achatado = {};
    for (const [idTurma, entrada] of Object.entries(mapa)) {
      achatado[idTurma] = entrada.vagas;
    }
    return achatado;
  }

  async setVagas(idTurma, vagas) {
    const resultado = (filaDeEscrita = filaDeEscrita.then(async () => {
      const mapa = await this._lerArquivo();
      mapa[String(idTurma)] = { vagas, atualizadoEm: new Date().toISOString() };
      await this._escreverArquivo(mapa);
    }));
    await resultado;
    return { id_turma: idTurma, vagas };
  }

  async _lerArquivo() {
    try {
      const conteudo = await fs.readFile(ARQUIVO_VAGAS, 'utf-8');
      return JSON.parse(conteudo);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return {};
      }
      console.warn(`Falha ao ler ${ARQUIVO_VAGAS}, tratando como vazio:`, err.message);
      return {};
    }
  }

  async _escreverArquivo(mapa) {
    await fs.mkdir(path.dirname(ARQUIVO_VAGAS), { recursive: true });
    await fs.writeFile(ARQUIVO_VAGAS, JSON.stringify(mapa, null, 2) + '\n', 'utf-8');
  }
}

module.exports = VagasService;
