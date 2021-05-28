import Aula from '../models/aula.model';
import CursoRepository from '../repositories/curso.repository';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import CursoController from './curso.controller';
import NotFoundException from '../utils/exceptions/no-content.exception';
import Mapper from '../utils/mapper';


export default class AulaController {
  async obterPorId(id: number, idCurso: number, errorOnNotFound = true): Promise<Aula> {
    Validador.validarParametros([{ id }, { idCurso }]);
    const curso = await new CursoController().obterPorId(idCurso);
    const aula = curso.aulas.find((a) => a.id === id);

    if (!aula && errorOnNotFound) {
      throw new NotFoundException(`Não foi localizado uma aula de id ${id}.`);
    }

    return aula;
  }

  async listar(idCurso: number): Promise<Aula[]> {
    Validador.validarParametros([{ idCurso }]);
    const curso = await new CursoController().obterPorId(idCurso);
    return curso.aulas;
  }

  async listarTodasAulas(): Promise<Aula[]> {
    const cursos = await new CursoController().listar();
    return cursos.flatMap(curso => curso.aulas);
  }

  async incluir(aula: Aula) {
    const { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{ nome }, { duracao }, { topicos }, { idCurso }]);

    this.verificarTopicos(aula.topicos);

    const curso = await new CursoController().obterPorId(idCurso);

    if (curso.aulas.some(aula => aula.nome === nome)) {
      throw new BusinessException('Já existe uma aula nesse curso com esse mesmo nome.');
    }

    const idAnterior = curso.aulas[curso.aulas.length - 1]?.id;
    aula.id = idAnterior ? idAnterior + 1 : 1;

    const aulaInclusao = Aula.include(aula);
    curso.aulas.push(aulaInclusao);

    await CursoRepository.alterar({ id: idCurso }, curso);
    return new Mensagem('Aula incluída com sucesso!', aulaInclusao);
  }

  async alterar(id: number, aula: Aula) {
    const { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{ id }, { idCurso }, { nome }, { duracao }, { topicos }]);

    this.verificarTopicos(aula.topicos);

    const curso = await CursoRepository.obterPorId(idCurso);

    if (curso.aulas.some(aula => aula.nome === nome && aula.id !== id)) {
      throw new BusinessException('Já existe outra aula nesse curso com esse mesmo nome.');
    }

    const aulaAtual = await this.obterPorId(id, idCurso);
    Mapper.merge(aulaAtual, aula, ['nome', 'duracao', 'topicos']);

    curso.aulas.map((a) => {
      if (a.id === id) {
        Object.keys(aulaAtual).forEach((k) => {
          a[k] = aulaAtual[k];
        });
      }
      return a;
    });

    await CursoRepository.alterar({ id: idCurso }, curso);
    return new Mensagem('Aula alterada com sucesso!', aulaAtual);
  }

  async excluir(id: number, idCurso: number) {
    Validador.validarParametros([{ id }, { idCurso }]);
    const curso = await new CursoController().obterPorId(idCurso);

    if (!curso.aulas.some(aula => aula.id === id)) {
      throw new NotFoundException(`Não foi localizado uma aula de id ${id}.`);
    } else if (curso.aulas.length <= 1) {
      throw new BusinessException(`Não é permitido excluir a última aula de um curso.`);
    }

    curso.aulas = curso.aulas.filter((a) => a.id !== id);
    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula excluída com sucesso!', { id, idCurso });
  }

  private verificarTopicos(topicos: string[]): void {
    if (!topicos?.length) {
      throw new BusinessException('A aula deve possuir ao menos 1 tópico.');
    } else if (topicos.length !== new Set<any>(topicos).size) {
      throw new BusinessException('Existem tópicos com nomes iguais nessa aula.');
    }
  }
}
