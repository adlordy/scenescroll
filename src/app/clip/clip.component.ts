import { Component, OnInit, ElementRef, HostListener } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'

import 'rxjs/add/operator/map'

export interface FrameStyle {
  top: string;
  "background-image": string;
  "background-position": string;
  "z-index": number;
}

export interface FrameInfo {
  frame: number;
  isActive: boolean;
  style: FrameStyle;
}

export interface ClipFrameInfo {
  start: number;
  stop: number;
}

export interface ClipInfo {
  width: number;
  height: number;
  r_frame_rate: string;
  duration: string;
  nb_frames: string;
  frames: ClipFrameInfo[];
}

export class Scene implements ClipFrameInfo {
  constructor(private id: number, private index: number, frame: ClipFrameInfo) {
    this.start = frame.start;
    this.stop = frame.stop;
    this.current = this.start + Math.floor(Math.min(this.stop - this.start, this.count) / 2);
    this.frames = this.getFrames();
  }
  count = 20;
  start: number;
  stop: number;
  current: number;
  frames: FrameInfo[];

  getTileUrl() {
    return "/data/tiles/" + this.id + "/tile-" + (this.index < 10 ? '0' : '') + this.index + ".jpg";
  }

  getFrames() {
    const count = Math.min(this.count, this.stop - this.start);
    return Array(count).fill(undefined).map((_, i) => {
      const frame = i + this.start;
      return <FrameInfo>{
        frame: frame,
        isActive: false,
        style: this.getStyle(frame)
      }
    });
  }

  getStyle(frame: number, current = this.current) {
    const index = frame - this.start;
    const offset = frame - current;
    const half = (this.count / 2);

    let top = 50 + 50 * Math.sin(Math.max(Math.min((offset / half), 1), -1) * Math.PI / 2);

    return <FrameStyle>{
      top: top + "%",
      "background-image": `url(${this.getTileUrl()})`,
      "background-position": `0 ${index * -240}px`,
      "z-index": this.count - Math.abs(offset),
      "opacity": 1 - (0.25 * Math.abs(offset) / half)
    };
  }

  select(frame: FrameInfo) {
    const previous = this.current;
    this.current = frame.frame;
    if (this.current > previous) {
      let last = this.frames[this.frames.length - 1].frame + 1;
      const newLast = Math.min(Math.floor(this.current + this.count / 2), this.stop - 2);
      let newFrames = [];
      while (last <= newLast) {
        const frame = last++;
        const newFrame = {
          frame: frame,
          style: this.getStyle(frame, previous),
          isActive: false
        };
        this.frames.push(newFrame);
      }
    }
    setTimeout(() => this.frames.forEach(f => f.style = this.getStyle(f.frame)), 0);
  }
}

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  id: number;
  info: ClipInfo;
  scenes: Scene[];
  activeScene: Scene;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private element: ElementRef) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        this.id = parseInt(params.get("id"));
        this.http.get<ClipInfo>(`/data/info/${this.id}.json`).subscribe(c => {
          this.info = c;
          this.scenes = this.info.frames.map((f, i) => new Scene(this.id, i, f));
        });
      });
  }

  select(scene: Scene, frame: FrameInfo) {
    this.activeScene = scene;
    scene.select(frame);
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

      if (Math.abs($event.clientX - this.mouseDown.clientX) > threshold) {
        const ul = this.getUl();
        if (ul){
          ul.scrollLeft = ul.scrollLeft + this.mouseDown.clientX - $event.clientX;
        }
      }

      if (Math.abs($event.clientY - this.mouseDown.clientY) > threshold) {
        const offset = this.mouseDown.clientY - $event.clientY;

      }

      this.mouseDown = $event;
    }
  }
}
