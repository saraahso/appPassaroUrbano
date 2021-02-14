import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OfertasService } from '../ofertas.service';
import { Oferta } from '../shared/oferta.model';
import { Subject } from 'rxjs/Subject';

import '../util/rxjs-extensions'

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers: [OfertasService]
})
export class TopoComponent implements OnInit {

  public ofertas: Observable<Oferta[]>
  private subjectPesquisa: Subject<string> = new Subject<string>()

  constructor(private ofertasService: OfertasService) { }

  ngOnInit() {
    this.ofertas = this.subjectPesquisa //retorno Oferta[]
      .debounceTime(1000) //executa a próxima ação após 1 segundo
      .distinctUntilChanged()
      .switchMap((termo: string) => {

        if (termo.trim() === '') {
          return Observable.of<Oferta[]>([])
        }

        return this.ofertasService.pesquisaOfertas(termo)
      })
      .catch((err: any) => {
        return Observable.of<Oferta[]>([])
      })


  }

  public pesquisa(termoDaPesquisa: string): void {
    this.subjectPesquisa.next(termoDaPesquisa)

  }

  public limpapesquisa(): void {
    this.subjectPesquisa.next('')
  }
}
