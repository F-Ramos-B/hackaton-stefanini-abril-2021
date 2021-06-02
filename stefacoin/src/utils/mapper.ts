export default class Mapper {
  /**
   * Retorna uma cópia inteira do objeto, opcionalmente pode incluir atributos a serem ignorados na cópia.
   * @param source Objeto a ser copiado.
   * @param exclude Array opcional de atributos a serem ignoradas do objeto final.
   * @returns Objeto copiado sem os os atributos escolhidos em exclude.
   */
  static copy<T>(source: T, exclude: Array<keyof T> = []): any {
    return Object.keys(source).reduce((objFinal, keyAtual: any) => {
      if (exclude.includes(keyAtual)) {
        return objFinal;
      }
      return {
        ...objFinal,
        [keyAtual]: source[keyAtual]
      };
    }, {});
  }

  /**
   * Retorna uma cópia do objeto contendo apenas os atributos escolhidos.
   * @param source Objeto a ser copiado.
   * @param keys Atributos que serão inclusos no objeto retornado.
   * @returns Objeto copiado apenas com os atributos escolhidos.
   */
  static pick<T>(source: T, keys: Array<keyof T>): any {
    return keys.reduce((obj, key) => (
      {
        ...obj,
        [key]: source[key]
      }
    ), {});
  }

  /**
   * Altera valores de atributos escolhidos em target com os presentes em source.
   * @param target Objeto alvo a ser alterado.
   * @param source Objeto que terá seus atributos aplicados em target.
   * @param keys Array de atributos de source que serão aplicados em target.
   */
  static merge<T>(target: T, source: T, keys: Array<keyof T>) {
    const chaves = Object.keys(source).filter(key => keys.includes(key as any));
    for (const key of chaves) {
      target[key] = source[key];
    }
  }

  static mergeCopy<T>(target: T, source: T, keys: Array<keyof T>) {
    const objeto = this.copy(target);
    const chaves = Object.keys(source).filter(key => keys.includes(key as any));

    for (const key of chaves) {
      objeto[key] = source[key];
    }
    return objeto;
  }
}