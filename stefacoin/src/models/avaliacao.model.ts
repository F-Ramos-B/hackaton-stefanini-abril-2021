import Mapper from "../utils/mapper";

export default class Avaliacao {
  idAluno: number;
  nota: number;

  constructor() { }

  static include(avaliacao: Avaliacao): Avaliacao {
    return Mapper.pick(avaliacao, ['idAluno', 'nota']);
  }
}
