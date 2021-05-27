import { TipoUsuario } from './../utils/tipo-usuario.enum';
import Aluno from '../entities/aluno.entity';
import alunoRepository from '../repositories/aluno.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import cursoRepository from '../repositories/curso.repository';
import UsuarioCursos from '../models/user-cursos.model';
import CadastroController from './cadastro.controller';
import Mapper from '../utils/mapper';
import BusinessException from '../utils/exceptions/business.exception';

const cadastroController = new CadastroController();
export default class AlunoController {
  async obterPorId(id: number): Promise<Aluno> {
    Validador.validarParametros([{ id }]);
    return await alunoRepository.obterPorId(id, true);
  }

  async obter(filtro: FilterQuery<Aluno> = {}): Promise<Aluno> {
    filtro.tipo = TipoUsuario.ALUNO;
    return await alunoRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Aluno> = {}): Promise<Aluno[]> {
    filtro.tipo = TipoUsuario.ALUNO;
    return await alunoRepository.listar(filtro);
  }

  async obterPorIdComCursos(id: number): Promise<UsuarioCursos<Aluno>> {
    Validador.validarParametros([{ id }]);

    const aluno = await this.obterPorId(id);
    const cursos = await cursoRepository.listar({ id: { $in: aluno.cursos } });

    return new UsuarioCursos<Aluno>(aluno, cursos);
  }

  async listarComCursos(filtro: FilterQuery<Aluno> = {}): Promise<UsuarioCursos<Aluno>[]> {
    const alunos = await this.listar(filtro);

    const cursos = await cursoRepository.listar({ id: { $in: alunos.flatMap(aluno => aluno.cursos) } });

    return alunos.map(aluno => new UsuarioCursos<Aluno>(aluno, cursos.filter(curso => aluno.cursos.includes(curso.id))));
  }

  // #pegabandeira
  async incluir(aluno: Aluno): Promise<Mensagem> {
    aluno.tipo = TipoUsuario.ALUNO;
    return cadastroController.cadastrar(aluno);
  }

  async alterar(id: number, aluno: Aluno): Promise<Mensagem> {
    const { nome, senha, idade, formacao } = aluno;
    Validador.validarParametros([{ id }, { nome }, { senha }, { idade }, { formacao }]);
    const alunoAtual = await this.obterPorId(id);

    Mapper.merge(alunoAtual, aluno, ['nome', 'senha', 'formacao', 'idade']);
    await alunoRepository.alterar({ id }, alunoAtual);

    return new Mensagem('Aluno alterado com sucesso!', Mapper.copy(alunoAtual, ['senha', 'cursos', 'tipo']));
  }

  async excluir(id: number): Promise<Mensagem> {
    Validador.validarParametros([{ id }]);
    const aluno = await this.obterPorId(id);

    if (aluno.cursos.length) {
      throw new BusinessException('Não é permitido excluir um aluno que esteja matriculado em cursos.');
    }

    await alunoRepository.excluir({ id });
    return new Mensagem('Aluno excluido com sucesso!', { id });
  }

  async matricular(idCurso: number, idAluno: number): Promise<Mensagem> {
    Validador.validarParametros([{ idCurso }, { idAluno }]);

    const curso = await cursoRepository.obterPorId(idCurso, true);
    const aluno = await alunoRepository.obterPorId(idAluno, true);

    if (aluno.cursos.includes(curso.id)) {
      throw new BusinessException('Impossível matricular novamente o aluno, ele já está matriculado nesse curso.');
    }

    aluno.cursos.push(curso.id);
    await alunoRepository.alterar({ id: aluno.id }, aluno);

    return new Mensagem('Aluno matriculado com sucesso!', await this.obterPorIdComCursos(aluno.id));
  }

  async desmatricular(idCurso: number, idAluno: number): Promise<Mensagem> {
    Validador.validarParametros([{ idCurso }, { idAluno }]);

    const curso = await cursoRepository.obterPorId(idCurso, true);
    const aluno = await alunoRepository.obterPorId(idAluno, true);

    if (!aluno.cursos.includes(curso.id)) {
      throw new BusinessException('Impossível desmatricular o aluno, ele não está matriculado nesse curso no momento.');
    }

    aluno.cursos = aluno.cursos.filter(curso => curso !== idCurso);
    await alunoRepository.alterar({ id: aluno.id }, aluno);

    return new Mensagem('Aluno desvinculado com sucesso!', await this.obterPorIdComCursos(aluno.id));
  }
}
