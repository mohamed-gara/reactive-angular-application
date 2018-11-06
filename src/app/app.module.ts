import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Component, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, publishReplay, shareReplay } from 'rxjs/operators';

interface KeyboardFormValues {
  keyboard?: Observable<{left: number, right: number}>;
  
  left: Observable<Number>;
  right: Observable<Number>;
}

interface KeyboardFormControls {
  keyboard?: FormGroup;
  
  left: FormControl;
  right: FormControl;
}

namespace KeyboardForm {
  export type Seed = { [P in keyof KeyboardFormValues]: string };
}

@Injectable()
export class KeyboardFormFactory {
  constructor(private fb: FormBuilder) { }
  
  createForm(seed?: KeyboardForm.Seed): { values: KeyboardFormValues, controls: KeyboardFormControls } {
    const definition = seed || defaultFormSeed();    
    const fg = this.fb.group(definition);

    return {values: createFormValues(fg), controls: createFormControls(fg)};
  }
}

function createFormValues(fg: FormGroup): KeyboardFormValues {
  const values = {} as KeyboardFormValues;

  values.keyboard = fg.valueChanges
                      .pipe(
                        startWith(fg.value),
                        shareReplay(1)
                      );
  for(let k in fg.value) {
    values[k] = fg.get(k)
                  .valueChanges
                  .pipe(
                    startWith(fg.get(k).value),
                    shareReplay(1)
                  );;
  }

  return values;
}

function createFormControls(fg: FormGroup): KeyboardFormControls {
  const controls = {} as KeyboardFormControls;

  controls.keyboard = fg;
  for(let k in fg.value) {
    controls[k] = fg.get(k);
  }

  return controls;
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

@Component({
  selector: 'app-root',
  template: `<form [formGroup]="keyboardControls.keyboard">
               <input formControlName="left"> + <input formControlName="right"> = {{this.result | async}}
             </form>
             <br>
             <button type="button" (click)="rest.next()">Reset</button>`,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // Input
  rest = new Subject<void>();

  // Input & Output
  keyboardValues: KeyboardFormValues;
  keyboardControls: KeyboardFormControls;
  
  // Output
  result: Observable<Number>;
  
  constructor(private formFactory: KeyboardFormFactory) {}
  
  ngOnInit() {
    const {values, controls} = this.formFactory.createForm();
    
    this.keyboardValues = values;
    this.keyboardControls = controls;

    this.result = combineLatest(
                    this.keyboardValues.left,
                    this.keyboardValues.right,
                  ).pipe(
                    map(toSum),
                    shareReplay(1)
                  );

    this.rest.subscribe(() => {
      this.keyboardControls.keyboard.setValue(defaultFormSeed());
    })
  } 
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
  providers: [KeyboardFormFactory],
  bootstrap: [AppComponent]
})
export class AppModule { }