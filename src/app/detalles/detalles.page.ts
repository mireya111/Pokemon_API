import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-detalles',
  standalone: true,
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  imports: [ IonicModule , NgFor, NgIf]
})
export class DetallesPage implements OnInit {
  pokemon: any;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;

      this.http.get<any>(url).subscribe({
        next: (data) => {
          this.pokemon = {
            id: data.id,
            name: data.name,
            height: data.height,
            weight: data.weight,
            image: data.sprites.front_default,
            types: data.types.map((t: any) => t.type.name),
            abilities: data.abilities.map((a: any) => a.ability.name),
            stats: data.stats.map((s: any) => ({
              name: s.stat.name,
              value: s.base_stat,
            })),
          };
          this.error = null;
        },
        error: (err) => {
          this.pokemon = null;
          this.error = 'No se encontró el Pokémon.';
          console.error(err);
        },
      });
    }
  }
}
