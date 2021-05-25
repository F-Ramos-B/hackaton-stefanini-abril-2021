import { SelectItem } from 'primeng/api';

export class BaseCrudEntity {
  id?: number;
  nome?: string;

  static asSelectItem(entity: BaseCrudEntity): SelectItem<number> {
    return {
      value: entity.id,
      label: entity.nome
    };
  }

  static asSelectItems(entities: BaseCrudEntity[]): SelectItem<number>[] {
    return entities.map(this.asSelectItem);
  }
}
