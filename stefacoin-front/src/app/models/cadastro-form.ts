import { BaseCrudEntity } from './base-crud-entity';
export interface CadastroForm extends BaseCrudEntity {
  email?: string;
  senha?: string;
  tipo?: number;
  idade?: number;
  formacao?: string;
}
