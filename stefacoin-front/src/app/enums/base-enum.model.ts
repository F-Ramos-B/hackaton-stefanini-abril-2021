import { SelectItem } from 'primeng/api';

export interface Enum<T> {
  id: T;
  descricao: string;
}

export abstract class BaseEnum {

  private static readonly CHAVE_VALORES_ENUM = 'values';

  public static valueOf<T>(id: T): Enum<T> {
    return this[this.CHAVE_VALORES_ENUM].find((item: Enum<T>) => item.id === id) as Enum<T>;
  }

  public static getValues<T>(): Enum<T>[] {
    return this[this.CHAVE_VALORES_ENUM] as Enum<T>[];
  }

  public static asSelectItem<T>(): SelectItem<T>[] {
    return this.getValues<T>().map((item: Enum<T>) => ({ label: item.descricao, value: item.id }));
  }

}
