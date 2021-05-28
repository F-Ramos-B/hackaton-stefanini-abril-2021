import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ListarCursosUsuarioComponent } from './components/shared/listar-cursos-usuario/listar-cursos-usuario.component';
import { MensagemValidacaoComponent } from './components/shared/mensagem-validacao/mensagem-validacao.component';
import { AlunoGuard } from './guards/aluno.guard';
import { AuthGuard } from './guards/auth.guard';
import { ProfessorGuard } from './guards/professor.guard';
import { HttpInterceptorService } from './interceptors/http-interceptor.service';
import { ListarAlunoComponent } from './pages/private/aluno/listar-aluno/listar-aluno.component';
import { DetalharCursoComponent } from './pages/private/curso/detalhar-curso/detalhar-curso.component';
import { IncluirCursoComponent } from './pages/private/curso/incluir-curso/incluir-curso.component';
import { ListarAulasCursoComponent } from './pages/private/curso/listar-aulas-curso/listar-aulas-curso.component';
import { ListarCursoComponent } from './pages/private/curso/listar-curso/listar-curso.component';
import { HomeComponent } from './pages/private/home/home.component';
import { ListarProfessorComponent } from './pages/private/professor/listar-professor/listar-professor.component';
import { CadastroComponent } from './pages/public/cadastro/cadastro.component';
import { LoginComponent } from './pages/public/login/login.component';
import { PaginaNaoEncontradaComponent } from './pages/public/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { MostrarNotaPipe } from './pipes/mostrar-nota.pipe';
import { TipoUsuarioPipe } from './pipes/tipo-usuario.pipe';


export function tokenGetter() {
  return localStorage.getItem('jwttoken');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListarProfessorComponent,
    CadastroComponent,
    HomeComponent,
    PaginaNaoEncontradaComponent,
    HeaderComponent,
    MensagemValidacaoComponent,
    TipoUsuarioPipe,
    ListarAlunoComponent,
    ListarCursoComponent,
    DetalharCursoComponent,
    IncluirCursoComponent,
    ListarAulasCursoComponent,
    MostrarNotaPipe,
    ListarCursosUsuarioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
    InputTextModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    RippleModule,
    SelectButtonModule,
    InputNumberModule,
    MenubarModule,
    TableModule,
    ConfirmDialogModule,
    DropdownModule,
    InputTextareaModule,
    CardModule,
    RatingModule,
    DialogModule
  ],
  providers: [
    HttpInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    AuthGuard,
    AlunoGuard,
    ProfessorGuard,
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
