import { Injectable } from '@angular/core';
import { SceneInfo } from "./models";
import { Subject } from 'rxjs/Subject'

@Injectable()
export class ClipService {

  from: number;
  to: number;

  private clipChanged = new Subject<SceneInfo>();

  clipChanged$ = this.clipChanged.asObservable();

  constructor() {

  }

  clip(frame: number) {
    if (this.from && this.to) {
      delete this.from;
      delete this.to;
    }

    if (!this.from) {
      this.from = frame;
    } else {
      this.to = frame;
    }

    this.clipChanged.next({ start: this.from, stop: this.to });
  }
}
