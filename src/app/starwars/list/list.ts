import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { flattenDeep, uniq } from 'lodash';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject, combineLatest, delay, EMPTY, expand, map, scan, share } from 'rxjs';

interface Result<T> {
  count: number;
  next: string;
  previous: string | null;
  results: T[];
}

interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

@Component({
  selector: 'app-list',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private http = inject(HttpClient);

  selectedFilter = new BehaviorSubject<string | null>(null);
  searchText = new BehaviorSubject<string>('');

  planets$ = this.http.get<Result<Planet>>('https://swapi.dev/api/planets').pipe(
    expand((res) => (res.next ? this.http.get<Result<Planet>>(res.next).pipe(delay(5000)) : EMPTY)),
    map((res) => res.results),
    scan((acc, curr) => acc.concat(curr), [] as Planet[]),
    share()
  );

  terrainTypes$ = this.planets$.pipe(
    map((planets) => {
      const terrains = planets.map((planet) => {
        let terrainsOfThePlanet = planet.terrain.split(', ');
        return terrainsOfThePlanet;
      });

      const uniqueTerrains = uniq(flattenDeep(terrains));
      return uniqueTerrains;
    })
  );

  filteredPlanets$ = combineLatest([this.planets$, this.selectedFilter, this.searchText]).pipe(
    map(([planets, selectedFilter, searchText]) => {
      let filtered = planets;
      if (selectedFilter) {
        filtered = filtered.filter((planet) => planet.terrain.includes(selectedFilter));
      }
      if (searchText.length) {
        filtered = filtered.filter((planet) =>
          planet.name.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      return filtered;
    }),
    share()
  );

  climateChartData$ = this.filteredPlanets$.pipe(
    map((planets) => {
      const climateCounts: { [key: string]: number } = {};
      planets.forEach((planet) => {
        const climates = planet.climate.split(', ');
        climates.forEach((climate) => {
          climateCounts[climate] = (climateCounts[climate] || 0) + 1;
        });
      });

      return {
        labels: Object.keys(climateCounts),
        datasets: [
          {
            data: Object.values(climateCounts),
          },
        ],
      } as ChartData<'pie'>;
    })
  );

  populationChartData$ = this.filteredPlanets$.pipe(
    map((planets) => {
      const planetsWithPopulation = planets
        .filter((p) => p.population !== 'unknown')
        .map((p) => ({ name: p.name, population: parseInt(p.population, 10) }))
        .sort((a, b) => b.population - a.population)
        .slice(0, 10);

      return {
        labels: planetsWithPopulation.map((p) => p.name),
        datasets: [
          {
            label: 'Population',
            data: planetsWithPopulation.map((p) => p.population),
          },
        ],
      } as ChartData<'bar'>;
    })
  );

  gravityChartData$ = this.filteredPlanets$.pipe(
    map((planets) => {
      const planetsWithGravity = planets
        .map((p) => ({ name: p.name, gravity: parseFloat(p.gravity) }))
        .filter((p) => !isNaN(p.gravity))
        .sort((a, b) => b.gravity - a.gravity)
        .slice(0, 10);

      return {
        labels: planetsWithGravity.map((p) => p.name),
        datasets: [
          {
            label: 'Gravity',
            data: planetsWithGravity.map((p) => p.gravity),
          },
        ],
      } as ChartData<'bar'>;
    })
  );

  chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  populationChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
}
