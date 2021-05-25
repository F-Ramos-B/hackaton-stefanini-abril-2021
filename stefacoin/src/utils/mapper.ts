export default class Mapper {
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

  static pick<T>(source: T, keys: Array<keyof T>): any {
    return keys.reduce((obj, key) => (
      {
        ...obj,
        [key]: source[key]
      }
    ), {});
  }

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