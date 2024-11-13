import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environment } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {
    constructor(private http: HttpClient) { }

    private baseUrl: string = environment.basedUrl;

    getHeroes():Observable<Hero[]> {
        return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
        .pipe(
            catchError(() => of([]))
        );
    }

    getHeroById(id: string):Observable<Hero | undefined> {
        return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
        .pipe(
            catchError(() => of(undefined))
        );
    }

    getSuggestions(query:string): Observable<Hero[]>{
        return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`)
    }

    addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero)
        .pipe(
            catchError(() => of(hero))
        );
    }

    updateHero(hero: Hero): Observable<Hero> {
        if(!hero.id) throw Error('Hero id is required');
        return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero)
        .pipe(
            catchError(() => of(hero))
        );
    }

    deleteHeroById(id: string): Observable<boolean> {

        return this.http.delete(`${this.baseUrl}/heroes/${id}`)
        .pipe(
            map(resp => true),
            catchError(() => of(false)),
        );
    }

}