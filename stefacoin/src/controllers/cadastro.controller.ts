import Aluno from '../entities/aluno.entity';
import Professor from '../entities/professor.entity';
import Usuario from '../entities/usuario.entity';
import alunoRepository from '../repositories/aluno.repository';
import professorRepository from '../repositories/professor.repository';
import BusinessException from '../utils/exceptions/business.exception';
import Mapper from '../utils/mapper';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from './../utils/tipo-usuario.enum';
import { Validador } from './../utils/utils';
import UsuarioController from './usuario.controller';

export default class CadastroController {
  async cadastrar(usuario: Usuario): Promise<Mensagem> {
    const { email, senha, nome, tipo } = usuario;
    Validador.validarParametros([{ email }, { senha }, { nome }, { tipo }]);

    await UsuarioController.validarEmail(email);

    return await (tipo === TipoUsuario.PROFESSOR ? this.cadastrarProfessor(usuario as Professor) : this.cadastrarAluno(usuario as Aluno));
  }

  private async cadastrarProfessor(professor: Professor): Promise<Mensagem> {
    const id = await professorRepository.incluir(Professor.include(professor));

    return new Mensagem('Professor incluído com sucesso.', {
      id,
      ...Mapper.pick(professor, ['nome', 'email'])
    });
  }

  private async cadastrarAluno(aluno: Aluno): Promise<Mensagem> {
    const { idade, formacao } = aluno;
    Validador.validarParametros([{ idade }, { formacao }]);

    if (idade < 18 || idade > 65) {
      throw new BusinessException('O aluno deve ter entre 18 a 65 anos.');
    }

    const id = await alunoRepository.incluir(Aluno.include(aluno));

    return new Mensagem('Aluno incluído com sucesso.', {
      id,
      ...Mapper.pick(aluno, ['nome', 'email', 'formacao', 'idade'])
    });
  }
}
