/*
 * Copyright (C) 2019 HAT Data Exchange Ltd - All Rights Reserved
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Written by Terry Lee <terry.lee@hatdex.org> 2, 2019
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CustomAngularMaterialModule } from '../../core/custom-angular-material.module';
import { HatClaimNewPasswordComponent } from './hat-claim-new-password.component';
import { PasswordStrengthIndicatorComponent
} from '../../shared/components/password-strength-indicator/password-strength-indicator.component';

describe('HatClaimNewPasswordComponent', () => {
  let component: HatClaimNewPasswordComponent;
  let fixture: ComponentFixture<HatClaimNewPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, CustomAngularMaterialModule ],
      declarations: [ HatClaimNewPasswordComponent, PasswordStrengthIndicatorComponent ],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HatClaimNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
