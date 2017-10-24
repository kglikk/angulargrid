import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService) { }

    canActivate() {
        if (this.auth.isAuthenticated())
            return true;

        window.location.href = 'http://localhost:5000/';
        return false;
    }
}