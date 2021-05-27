export abstract class StefacoinUtils {
  static isLista(valor: any): boolean {
    return valor && Array.isArray(valor);
  }

  static isListaPreenchida(valor: any): boolean {
    return this.isLista(valor) && valor.length > 0;
  }

  static isStringOrNumber(valor: any) {
    return this.isNullUndefinedNaN(valor) && ['string', 'number'].includes(typeof valor) && valor.toString().trim() !== '';
  }

  static isNullUndefinedNaN(valor: any): boolean {
    return ![null, undefined, NaN].includes(valor);
  }

  static isObject(valor: any): boolean {
    return this.isNullUndefinedNaN(valor) && !this.isLista(valor) && typeof valor === 'object';
  }
}