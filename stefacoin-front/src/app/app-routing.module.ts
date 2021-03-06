import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EnumParamsRotas } from './enums/enum-params-rotas.model';
import { AuthGuard } from './guards/auth.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';
import { ParamsGuard } from './guards/params.guard';
import { ProfessorGuard } from './guards/professor.guard';
import { ListarAlunoComponent } from './pages/private/aluno/listar-aluno/listar-aluno.component';
import { DetalharCursoComponent } from './pages/private/curso/detalhar-curso/detalhar-curso.component';
import { IncluirCursoComponent } from './pages/private/curso/incluir-curso/incluir-curso.component';
import { ListarCursoComponent } from './pages/private/curso/listar-curso/listar-curso.component';
import { HomeComponent } from './pages/private/home/home.component';
import { ListarProfessorComponent } from './pages/private/professor/listar-professor/listar-professor.component';
import { CadastroComponent } from './pages/public/cadastro/cadastro.component';
import { LoginComponent } from './pages/public/login/login.component';
import { PaginaNaoEncontradaComponent } from './pages/public/pagina-nao-encontrada/pagina-nao-encontrada.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  {
    path: 'professores',
    canActivate: [AuthGuard],
    component: ListarProfessorComponent
  },
  {
    path: 'professores',
    canActivate: [AuthGuard],
    canActivateChild: [ProfessorGuard],
    children: [
      {
        path: 'incluir',
        component: CadastroComponent
      },
      {
        path: 'editar',
        canActivate: [ParamsGuard.forParams([EnumParamsRotas.PARAM_ID])],
        component: CadastroComponent
      }
    ]
  },
  {
    path: 'cursos',
    canActivate: [AuthGuard],
    component: ListarCursoComponent
  },
  {
    path: 'cursos/detalhar',
    canActivate: [AuthGuard, ParamsGuard.forParams([EnumParamsRotas.PARAM_ID])],
    component: DetalharCursoComponent
  },
  {
    path: 'cursos',
    canActivate: [AuthGuard],
    canActivateChild: [ProfessorGuard],
    children: [
      {
        path: 'incluir',
        component: IncluirCursoComponent
      },
      {
        path: 'editar',
        canActivate: [ParamsGuard.forParams([EnumParamsRotas.PARAM_ID])],
        component: IncluirCursoComponent
      }
    ]
  },
  {
    path: 'alunos',
    canActivate: [AuthGuard],
    component: ListarAlunoComponent
  },
  {
    path: 'alunos',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'incluir',
        component: CadastroComponent
      },
      {
        path: 'editar',
        canActivate: [ParamsGuard.forParams([EnumParamsRotas.PARAM_ID])],
        component: CadastroComponent
      }
    ]
  },
  {
    path: 'nova-conta',
    canActivate: [LoggedOutGuard],
    component: CadastroComponent
  },
  {
    path: 'login',
    canActivate: [LoggedOutGuard],
    component: LoginComponent
  },
  {
    path: '**',
    component: PaginaNaoEncontradaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
