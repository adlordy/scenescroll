import { Component, OnInit, ElementRef, HostListener } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'

import 'rxjs/add/operator/map'
import { ClipInfo } from "../models";
import { ClipService } from "../clip.service";

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  providers: [ClipService]
})
export class ClipComponent implements OnInit {
  id: number;
  info: ClipInfo;
  selectedScene: number;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private element: ElementRef) {
  }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.http.get<ClipInfo>(`/data/info/${this.id}.json`)
      .subscribe(c => this.info = c);
  }

  mouseDown: MouseEvent;
  ul: HTMLUListElement;

  private getUl() {
    if (this.ul)
      return this.ul;
    this.ul = <HTMLUListElement>(<HTMLElement>this.element.nativeElement).querySelector("ul.scenes");
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp($event: MouseEvent) {
    delete this.mouseDown;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown($event: MouseEvent) {
    this.mouseDown = $event;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove($event: MouseEvent) {
    if (this.mouseDown) {
      $event.preventDefault();
      const threshold = 2;

      if (Math.abs($event.clientX - this.mouseDown.clientX) > threshold && Math.abs($event.clientY - this.mouseDown.clientY) <= threshold) {
        const ul = this.getUl();
        if (ul) {
          ul.scrollLeft = ul.scrollLeft + this.mouseDown.clientX - $event.clientX;
        }
      }

      this.mouseDown = $event;
    }
  }

  select(index: number) {
    this.selectedScene = index;
  }
}
