/*
 * Copyright (C) 2016 HAT Data Exchange Ltd - All Rights Reserved
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Written by Augustinas Markevicius <augustinas.markevicius@hatdex.org> 2016
 */

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyDayComponent } from './my-day.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { MapComponent } from '../../locations/map/map.component';

xdescribe('MyDayComponent', () => {
  let component: MyDayComponent;
  let fixture: ComponentFixture<MyDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDayComponent, SpinnerComponent, MapComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
