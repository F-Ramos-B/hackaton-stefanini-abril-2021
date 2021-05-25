import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'app-mensagem-validacao',
    templateUrl: './mensagem-validacao.component.html'
})
export class MensagemValidacaoComponent implements ControlValueAccessor {

    @Input() type: string = 'required';
    @Input() errorMessage: string = 'Campo obrigatório';
    @Input() alertType: string = 'error';
    @Input() isInline: boolean = true;
    @Input() styleClass: string;

    control: NgControl;

    constructor(@Optional() @Self() control: NgControl) {
        if (control) {
            control.valueAccessor = this;
            this.control = control;
        }
    }

    hasInvalidateType() {
        return (this.control.dirty || this.control.touched) && this.control.invalid && this.control.errors[this.type];
    }


    onChange = (value: any) => { };
    onTouched = () => { };


    writeValue(obj: any): void {
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
    }

}
