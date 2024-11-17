import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate {
    
    constructor( private authService: AuthService,
                 private router: Router,
    ) { }

    private checkAuthStatus(): MaybeAsync<GuardResult> {

        return this.authService.checkAuthentication()
        .pipe(
            tap(isAuthenticated => console.log({'heroes Authenticated': isAuthenticated})),
            tap(isAuthenticated => {
                if(!isAuthenticated) {
                    this.router.navigate(['/auth/login']);
                }
            }),
        );
        
    }

    canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        
        return this.checkAuthStatus();
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        
        return this.checkAuthStatus();
    }

    
}