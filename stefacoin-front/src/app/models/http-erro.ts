import { HttpErrorResponse } from "@angular/common/http";

export default class HttpErrorMensagem<T> extends HttpErrorResponse {
  error: T
}
