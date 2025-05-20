import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  
} from '@angular/fire/firestore';

@Component({
  selector: 'app-detalles',
  standalone: true,
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  imports: [IonicModule, NgFor, NgIf, FormsModule, CommonModule]
})
export class DetallesPage implements OnInit {
  pokemon: any;
  error: string | null = null;
  opinion: string | null = null;
  resenas: any[] = []; // ✅ Sin "ñ"

  firestore = inject(Firestore);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  async publishRes() {
    if (!this.opinion || !this.pokemon) return;

    const resena = {
      selectedpokemon: this.pokemon,
      nombre: this.pokemon.name,
      opinion: this.opinion,
      timestamp: new Date()
    };

    try {
      const resenasRef = collection(this.firestore, 'Reseñas');
      await addDoc(resenasRef, resena);
      console.log('Datos enviados a Firestore:', resena);

      this.opinion = null;
      await this.cargarResenas(this.pokemon.name);
    } catch (error) {
      console.error('Error al guardar reseña:', error);
    }
  }

  async cargarResenas(nombre: string) {
    try {
      const resenasRef = collection(this.firestore, 'Reseñas');
      const q = query(resenasRef, where('nombre', '==', nombre));
      const querySnapshot = await getDocs(q);
      this.resenas = querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
    }
  }

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;

      this.http.get<any>(url).subscribe({
        next: async (data) => {
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
          await this.cargarResenas(data.name);
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

