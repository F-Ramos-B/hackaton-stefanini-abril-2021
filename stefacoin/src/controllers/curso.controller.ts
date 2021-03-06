import Curso from '../entities/curso.entity';
import Avaliacao from '../models/avaliacao.model';
import CursoProfessor from '../models/curso-professor.model';
import alunoRepository from '../repositories/aluno.repository';
import CursoRepository from '../repositories/curso.repository';
import professorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mapper from '../utils/mapper';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import { Aula } from './../../../stefacoin-front/src/app/models/aula';
import { TipoUsuario } from './../utils/tipo-usuario.enum';
import AulaController from './aula.controller';

interface ErroAulas {
  aula: Aula;
  erro: string;
}

export default class CursoController {

  async obterPorId(id: number): Promise<Curso> {
    Validador.validarParametros([{ id }]);
    return await CursoRepository.obterPorId(id, true);
  }

  async obter(filtro: FilterQuery<Curso> = {}): Promise<Curso> {
    return await CursoRepository.obter(filtro);
  }

  async listar(filtro: FilterQuery<Curso> = {}): Promise<Curso[]> {
    return await CursoRepository.listar(filtro);
  }

  async obterPorIdComProfessor(id: number): Promise<CursoProfessor> {
    Validador.validarParametros([{ id }]);

    const curso = await this.obterPorId(id);
    const professor = await professorRepository.obterPorId(curso.idProfessor);

    return new CursoProfessor(curso, professor);
  }

  async listarComProfessor(filtro: FilterQuery<Curso> = {}): Promise<CursoProfessor[]> {
    const cursos = await this.listar(filtro);
    const professores = await professorRepository.listar({ id: { $in: cursos.map(curso => curso.idProfessor) } });

    return cursos.map(curso => new CursoProfessor(curso, professores.find(prof => prof.id === curso.idProfessor)));
  }

  async incluir(curso: Curso): Promise<Mensagem> {
    const { nome, descricao, aulas, idProfessor } = curso;
    Validador.validarParametros([{ nome }, { descricao }, { aulas }, { idProfessor }]);

    const verificarNomeExistente = await this.obter({ nome: { $eq: nome } });

    if (verificarNomeExistente) {
      throw new BusinessException('J?? existe um curso cadastrado com esse nome');
    }

    const id = await CursoRepository.incluir(Curso.include(curso));

    const erros: ErroAulas[] = await this.aplicarAulas(id, curso);

    return new Mensagem(
      `Curso alterado com sucesso! ${erros.length ? 'Algumas aulas fornecidas n??o puderam ser validadas e por isso n??o foram aplicadas.' : ''}`.trim(),
      { curso: await this.obterPorIdComProfessor(id), erros }
    );
  }

  async alterar(id: number, curso: Curso): Promise<Mensagem> {
    const { nome, descricao, aulas, idProfessor } = curso;
    Validador.validarParametros([{ id }, { nome }, { descricao }, { aulas }, { idProfessor }]);

    const verificarNomeExistente = await this.obter({ nome: { $eq: nome }, id: { $ne: id } });

    if (verificarNomeExistente) {
      throw new BusinessException('N??o ?? poss??vel usar esse nome pois j?? existe outro curso com ele.');
    }

    const cursoAtual = await this.obterPorId(id);
    Mapper.merge(cursoAtual, curso, ['nome', 'descricao', 'idProfessor']);

    await CursoRepository.alterar({ id }, cursoAtual);

    const erros: ErroAulas[] = await this.aplicarAulas(id, curso);

    return new Mensagem(
      `Curso alterado com sucesso! ${erros.length ? 'Algumas aulas fornecidas n??o puderam ser validadas e por isso n??o foram aplicadas.' : ''}`.trim(),
      { curso: await this.obterPorIdComProfessor(id), erros }
    );
  }

  async excluir(id: number): Promise<Mensagem> {
    Validador.validarParametros([{ id }]);
    await this.obterPorId(id);

    //const alunoInscrito = await alunoRepository.obter({ cursos: { $includes: id } });
    const alunos = await alunoRepository.listar({ tipo: { $eq: TipoUsuario.ALUNO } });

    if (alunos.some(aluno => aluno.cursos.includes(id))) {
      throw new BusinessException('N??o ?? poss??vel excluir um curso que tenha alunos matriculados.');
    }

    await CursoRepository.excluir({ id });
    return new Mensagem('Curso exclu??do com sucesso!', { id });
  }

  async avaliar(id: number, avaliacao: Avaliacao): Promise<Mensagem> {
    const { idAluno, nota } = avaliacao;
    Validador.validarParametros([{ id }, { idAluno }, { nota }]);

    if (nota < 0 || nota > 5) {
      throw new BusinessException('Nota da avalia????o do curso deve ser de 0 a 5');
    }

    const cursoAtual = await this.obterPorId(id);
    const avaliacaoIncluir = Avaliacao.include(avaliacao);
    const indexAvaliacaoExistente = cursoAtual.avaliacoes.findIndex(avaliacao => avaliacao.idAluno === idAluno);

    if (indexAvaliacaoExistente !== -1) {
      cursoAtual.avaliacoes[indexAvaliacaoExistente] = avaliacaoIncluir;
    } else {
      cursoAtual.avaliacoes.push(avaliacaoIncluir);
    }

    await CursoRepository.alterar({ id }, cursoAtual);
    return new Mensagem('Curso avaliado com sucesso!', { idCurso: id, avaliacao: avaliacaoIncluir });
  }

  private async aplicarAulas(id: number, curso: Curso): Promise<ErroAulas[]> {
    const aulaController = new AulaController();
    const errosAulas: ErroAulas[] = [];

    for (const aula of curso.aulas) {
      try {
        aula.idCurso = id;
        await (aula.id ? aulaController.alterar(aula.id, aula) : aulaController.incluir(aula));
      } catch (err: any) {
        errosAulas.push({ aula, erro: err.message });
      }
    }

    return errosAulas;
  }
}
