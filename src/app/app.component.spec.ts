import { TestBed, async } from '@angular/core/testing';
import { AppComponent, KeyboardFormFactory } from './app.module';
import { FormBuilder } from '@angular/forms';
import { last } from 'rxjs/operators';

describe('AppComponent', () => {
  it('should be initialized with 0 + 0 = 0', () => {
    // init sut
    const sut = new AppComponent(new KeyboardFormFactory(new FormBuilder()));
    sut.ngOnInit();
  
    // check initial state 0 + 0 = 0
    sut.keyboardValues.keyboard.subscribe(keyboard => {
      expect(keyboard).toEqual({left: 0, right: 0});
    });

    sut.keyboardValues.left.subscribe(left => {
      expect(left).toEqual(0);
    });

    sut.keyboardValues.right.subscribe(right => {
      expect(right).toEqual(0);
    });

    sut.result.subscribe(result => {
      expect(result).toEqual(0);
    });
  }); 

  it('5 + 10 = 15', () => {
    // init sut
    const stateSnapshot: any = {};
    const sut = new AppComponent(new KeyboardFormFactory(new FormBuilder()));
    sut.ngOnInit();

    // init inputs & outputs
    sut.keyboardValues.keyboard.subscribe(keyboard => {
      stateSnapshot.keyboard = keyboard;
    });

    sut.keyboardValues.left.subscribe(left => {
      stateSnapshot.left = left;
    });

    sut.keyboardValues.right.subscribe(right => {
      stateSnapshot.right = right;
    });

    sut.result.subscribe(result => {
      stateSnapshot.result = result;
    });

    // set 5 & 10
    sut.keyboardControls.left.setValue(5);
    sut.keyboardControls.right.setValue(10);
  
    // check 5 + 10 = 15
    expect(stateSnapshot.keyboard).toEqual({left: 5, right: 10});
    expect(stateSnapshot.left).toEqual(5);
    expect(stateSnapshot.right).toEqual(10);
    expect(stateSnapshot.result).toEqual(15);
  });

  it('should reset', () => {
    // init sut
    const stateSnapshot: any = {};
    const sut = new AppComponent(new KeyboardFormFactory(new FormBuilder()));
    sut.ngOnInit();

    // init inputs & outputs
    sut.keyboardValues.keyboard.subscribe(keyboard => {
      stateSnapshot.keyboard = keyboard;
    });

    sut.keyboardValues.left.subscribe(left => {
      stateSnapshot.left = left;
    });

    sut.keyboardValues.right.subscribe(right => {
      stateSnapshot.right = right;
    });

    sut.result.subscribe(result => {
      stateSnapshot.result = result;
    });

    // set 5 then 10
    sut.keyboardControls.left.setValue(5);
    sut.keyboardControls.right.setValue(10);
    // reset
    sut.rest.next();
  
    // check 0 + 0 = 0
    expect(stateSnapshot.keyboard).toEqual({left: 0, right: 0});
    expect(stateSnapshot.left).toEqual(0);
    expect(stateSnapshot.right).toEqual(0);
    expect(stateSnapshot.result).toEqual(0);
  });
});