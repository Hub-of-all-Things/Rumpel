/*
 * Copyright (C) 2017 HAT Data Exchange Ltd - All Rights Reserved
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Written by Augustinas Markevicius <augustinas.markevicius@hatdex.org> 2, 2017
 */

/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MashupsComponent } from './mashups.component';
import {MashupsModule} from '../mashups.module';
import {RouterTestingModule} from '@angular/router/testing';

describe('Component: Mashups', () => {
  let fixture: ComponentFixture<MashupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MashupsModule, RouterTestingModule.withRoutes([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MashupsComponent);
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });
});
