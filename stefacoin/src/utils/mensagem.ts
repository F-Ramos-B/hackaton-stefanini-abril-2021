export default class Mensagem {
  mensagem: string;
  data?: any;
  code?: number;

  constructor(mensagem: string, data = undefined, code = undefined) {
    this.mensagem = mensagem;
    this.data = data;
    this.code = code;
  }
}
