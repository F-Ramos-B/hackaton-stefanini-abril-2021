import Professor from '../entities/professor.entity';
import UsuarioCursos from '../models/user-cursos.model';
import cursoRepository from '../repositories/curso.repository';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mapper from '../utils/mapper';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import { TipoUsuario } from './../utils/tipo-usuario.enum';
import CadastroController from './cadastro.controller';

const cadastroController = new CadastroController();

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> {
    Validador.validarParametros([{ id }]);
    return await ProfessorRepository.obterPorId(id, true);
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    filtro.tipo = TipoUsuario.PROFESSOR;
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> {
    filtro.tipo = TipoUsuario.PROFESSOR;
    return await ProfessorRepository.listar(filtro);
  }

  async obterPorIdComCursos(id: number): Promise<UsuarioCursos<Professor>> {
    Validador.validarParametros([{ id }]);

    const professor = await this.obterPorId(id);
    const cursos = await cursoRepository.listar({ idProfessor: { $eq: id } });

    return new UsuarioCursos<Professor>(professor, cursos);
  }

  async listarComCursos(filtro: FilterQuery<Professor> = {}): Promise<UsuarioCursos<Professor>[]> {
    const professores = await this.listar(filtro);
    const cursos = await cursoRepository.listar({ idProfessor: { $in: professores.map(prof => prof.id) } });

    return professores.map(prof => new UsuarioCursos<Professor>(prof, cursos.filter(curso => curso.idProfessor === prof.id)));
  }

  // #pegabandeira
  async incluir(professor: Professor): Promise<Mensagem> {
    professor.tipo = TipoUsuario.PROFESSOR;
    return cadastroController.cadastrar(professor);
  }

  async alterar(id: number, professor: Professor): Promise<Mensagem> {
    const { nome, senha } = professor;
    Validador.validarParametros([{ id }, { nome }, { senha }]);
    const professorAtual = await this.obterPorId(id);

    Mapper.merge(professorAtual, professor, ['nome', 'senha']);
    await ProfessorRepository.alterar({ id }, professorAtual);
    return new Mensagem('Professor alterado com sucesso!', Mapper.copy(professorAtual, ['senha', 'tipo']));
  }

  async excluir(id: number): Promise<Mensagem> {
    Validador.validarParametros([{ id }]);

    const professor = await this.obterPorId(id);
    const curso = await cursoRepository.obter({ idProfessor: { $eq: professor.id } })

    if (curso) {
      throw new BusinessException('Não é permitido excluir um professor que está encarregado de um curso.');
    }

    await ProfessorRepository.excluir({ id });
    return new Mensagem('Professor excluido com sucesso!', { id });
  }
}
