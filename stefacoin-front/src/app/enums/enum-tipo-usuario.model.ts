import { BaseEnum, Enum } from './base-enum.model';

export class EnumTipoUsuario extends BaseEnum implements Enum<number> {

  static readonly PROFESSOR = new EnumTipoUsuario(1, 'Professor');
  static readonly ALUNO = new EnumTipoUsuario(2, 'Aluno');

  static readonly values: EnumTipoUsuario[] = [
    EnumTipoUsuario.PROFESSOR,
    EnumTipoUsuario.ALUNO
  ];

  static readonly is = {
    PROFESSOR: (id: number): boolean => EnumTipoUsuario.PROFESSOR.id === id,
    ALUNO: (id: number): boolean => EnumTipoUsuario.ALUNO.id === id
  };

  // private to disallow creating other instances of this type
  private constructor(public readonly id: number, public readonly descricao: string) { super(); }

}
