import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }
  ngOnInit(): void {

    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params.
    pipe(
      switchMap( ({id})=>this.heroesService.getHeroById(id)),

    ).subscribe(hero => {
      if(!hero) return this.router.navigateByUrl('/');

      this.heroForm.reset(hero);
      return;
  });

}
  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero
  }

  public heroForm = new FormGroup({
    id: new FormControl(''),               
    superhero: new FormControl('',{nonNullable: true}),
    publisher: new FormControl<Publisher>(Publisher.MarvelComics) ,      
    alter_ego: new FormControl('')  ,     
    first_appearance: new FormControl(''),
    characters: new FormControl(''),      
    alt_img: new FormControl('')  ,     
  });

  public publishers=[
    {id:'DC Comics', desc: 'DC - Comics'},
    {id:'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  onSubmit():void {

    if(this.heroForm.invalid) return;
    if(this.currentHero.id) {
      
      this.heroesService.updateHero(this.currentHero)
      .subscribe(hero => {
      this.showSnackBar(`${hero.superhero} ha sido actualizado`);
      });
      return;
    }

    this.heroesService.addHero(this.currentHero)
    .subscribe(hero => {
      this.router.navigate([`/heroes/edit/${hero.id}`]);
      this.showSnackBar(`${hero.superhero} ha sido creado`);
    });
  }

  onDeleteHero():void {
    if(!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
    .pipe(
      filter((result:boolean) => result),
      switchMap(()=>this.heroesService.deleteHeroById(this.currentHero.id)),
      filter((wasDeleted:boolean) => wasDeleted),
    )
    .subscribe(result => {
      this.showSnackBar(`${this.currentHero.superhero} ha sido eliminado`);
      this.router.navigate(['/heroes']);
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   if(!result) return;
    //   console.log({result});
    //   this.heroesService.deleteHeroById(this.currentHero.id)
    //   .subscribe(wasDeleted=> {
    //     if(wasDeleted) {
    //       this.showSnackBar(`${this.currentHero.superhero} ha sido eliminado`);
    //       this.router.navigate(['/heroes']);
    //     }
    //   })
    // });

  }

  showSnackBar(message: string){
    this.snackBar.open(message, 'done',{
      duration: 2500
    })
  }
}
