import Mapper from "../utils/mapper";

export default class Aula {
  id: number;
  nome: string;
  duracao: number;
  idCurso: number;
  topicos: string[];

  constructor() { }

  static include(aula: Aula): Aula {
    return Mapper.pick(aula, ['nome', 'duracao', 'topicos', 'idCurso']);
  }
}
