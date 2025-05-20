import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [ IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit{
  //Sobreeescritura de metodos
  pokemons: any[] = [];
  pokemonsFiltrados: any[] = [];
  offeset=0; 
  limit=20;
  loading=false;
  nombreABuscar: string = '';

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPokemons();
  }

  //Se llama 
  loadPokemons(event?: any) {
    if(this.loading) return;
    this.loading=true;
    //Se llama a la API
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offeset}`).subscribe((response) => {
      this.pokemons = [...this.pokemons, ...response.results];
      this.pokemonsFiltrados = this.pokemons
      this.offeset += this.limit;
      this.loading = false;
      if (event) {
        event.target.complete();
      }

      if(response.next == null&&event){
        event.target.disabled=true;
      }
    });
  }

  getImageUrl(pokemon: any): string {
    const urlParts = pokemon.url.split('/');
    const id = urlParts[urlParts.length - 2];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  getDetalles(name: string){
    this.router.navigate([`detalles/${name}`]);
  }

  buscarPokemon(){
    const nombre = this.nombreABuscar.trim().toLocaleLowerCase(); 
    if(!nombre){
      this.pokemonsFiltrados = this.pokemons;
      return ; 
    }
    this.pokemonsFiltrados = this.pokemons.filter(p=> p.name.toLowerCase().includes(nombre))
  }
}
