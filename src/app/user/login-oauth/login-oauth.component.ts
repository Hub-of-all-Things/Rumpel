/*
 * Copyright (C) 2017 HAT Data Exchange Ltd - All Rights Reserved
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Written by Augustinas Markevicius <augustinas.markevicius@hatdex.org> 4, 2017
 */

import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { APP_CONFIG, AppConfig } from '../../app.config';
import { HatApplication, HatApplicationContent } from '../../explore/hat-application.interface';

@Component({
  selector: 'rum-login-oauth',
  templateUrl: './login-oauth.component.html',
  styleUrls: ['./login-oauth.component.scss']
})
export class LoginOauthComponent implements OnInit {
  public hatDomain: string;
  public errorMessage: string;
  public hatApp: HatApplicationContent;

  constructor(@Inject(APP_CONFIG) public config: AppConfig,
              private authSvc: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const name = this.route.snapshot.queryParams['name'];
    const redirect = this.route.snapshot.queryParams['redirect'];

    if (name && redirect) {
      const safeName = name.toLowerCase();

      this.authSvc.getApplicationDetails(safeName, redirect)
        .subscribe(
      (hatApp: HatApplication) => {

        if (hatApp.enabled && !hatApp.needsUpdating) {
          this.buildRedirect(safeName);
        } else {
          this.hatApp = hatApp.application;
        }
      },
      error => {
          console.warn('Failed to login. Reason: ', error);
          this.errorMessage = 'ERROR: Failed to obtain permission profile. Is the app registered?';
        }
      );
    } else {
      this.errorMessage = 'ERROR: App details incorrect. Please contact the app developer and let them know.';
    }
  }

  get username(): string {
    const host = window.location.hostname;

    return host.substring(0, host.indexOf('.'));
  }

  clearError() {
    this.errorMessage = null;
  }

  buildRedirect(appName: string): void {
    this.authSvc.appLogin(appName).subscribe((accessToken: string) => {
      window.location.href = `${this.route.snapshot.queryParams['redirect']}?token=${accessToken}`;
    });
  }

  agreeTerms(appId: string): void {
    this.authSvc.setupApplication(appId).subscribe((hatApp: HatApplication) => this.buildRedirect(appId));
  }

  declineTerms(): void {
    window.location.href = this.route.snapshot.queryParams['fallback'];
  }

}
