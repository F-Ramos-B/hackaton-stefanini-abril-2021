import Entity from '../entities/entity';
import Database, { FilterQuery } from '../utils/database/database';
import Exception from '../utils/exceptions/exception';
import NotFoundException from '../utils/exceptions/no-content.exception';
import { Tables } from '../utils/tables.enum';

export default class Repository<T extends Entity> {
  table: Tables;

  verify<E extends Exception>(resultado: T, erro: E) {
    if (!resultado) {
      throw erro;
    }
    return resultado;
  }

  constructor(table: Tables) {
    this.table = table;
  }

  async listar(filtro?: FilterQuery<T>): Promise<T[]> {
    return Database.listar<T>(filtro, this.table);
  }

  async obter(filtro: FilterQuery<T>, errorOnNotFound = false): Promise<T> {
    const resultado = await Database.obter<T>(filtro, this.table);
    return errorOnNotFound ? this.verify(resultado, new NotFoundException(`Nenhum resultado encontrado em ${this.table} com o filtro fornecido.`)) : resultado;
  }

  async obterPorId(id: number, errorOnNotFound = false): Promise<T> {
    const resultado = await Database.obterPorId<T>(id, this.table);
    return errorOnNotFound ? this.verify(resultado, new NotFoundException(`Não foi localizado um ${this.table} de id ${id}.`)) : resultado;
  }

  async incluir(dado: T | Partial<T>): Promise<number> {
    return Database.incluir<T>(dado, this.table);
  }

  async alterar(filtro: FilterQuery<T>, dado: Partial<T>): Promise<number> {
    return Database.alterar<T>(filtro, dado, this.table);
  }

  async excluir(filtro: FilterQuery<T>): Promise<number> {
    return Database.excluir<T>(filtro, this.table);
  }
}
