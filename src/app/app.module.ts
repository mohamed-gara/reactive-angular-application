import {BrowserModule} from '@angular/platform-browser';
import {ChangeDetectionStrategy, Component, Injectable, NgModule, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {combineLatest, Observable, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface KeyboardForm extends FormGroup {
  controls: KeyboardForm.Controls;

  setValue(value: KeyboardForm.Model, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void;
}

namespace KeyboardForm {
  /* tslint:disable:interface-over-type-literal */
  export type Controls = {
    left: FormControl;
    right: FormControl;
  };

  export type Model = {
    left: number;
    right: number;
  };
  /* tslint:enable:interface-over-type-literal */
}

@Injectable({providedIn: 'root'})
export class KeyboardFormFactory {
  constructor(private fb: FormBuilder) {
  }

  create(seed?: KeyboardForm.Model): KeyboardForm {
    return this.fb.group(seed || defaultFormSeed()) as KeyboardForm;
  }
}

@Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="form">
      <input formControlName="left"> + <input formControlName="right"> = {{result | async}}
             </form>
             <br>
    <button type="button" (click)="reset.next()">Reset</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  // Input
  reset = new Subject<void>();

  // Input & Output
  form: KeyboardForm;

  // Output
  result: Observable<Number>;

  constructor(private formFactory: KeyboardFormFactory) {}

  ngOnInit() {
    this.form = this.formFactory.create();

    this.result = combineLatest(
                    this.form.controls.left.valueChanges,
                    this.form.controls.right.valueChanges,
                  ).pipe(
                    map(toSum),
                    startWith(0)
                  );

    this.reset.subscribe(() => {
      this.form.setValue(defaultFormSeed());
    });
  }
}

function toSum([lt, rt]) {
  return Number(lt) + Number(rt);
}

function defaultFormSeed() {
  return {
    left: 0,
    right: 0
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
