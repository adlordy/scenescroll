import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { SceneInfo, FrameInfo, FrameStyle } from "../models";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'scene-view',
  templateUrl: './scene-view.component.html',
  styleUrls: ['./scene-view.component.css']
})
export class SceneViewComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
  }

  id: number;

  @Input()
  index: number;
  @Input()
  scene: SceneInfo;
  @Output()
  selected = new EventEmitter<number>();

  count = 20;
  start: number;
  stop: number;
  current: number;
  frames: FrameInfo[];

  ngOnInit() {
    this.start = this.scene.start;
    this.stop = this.scene.stop;
    this.current = this.start + Math.floor(Math.min(this.stop - this.start, this.count) / 2);
    this.frames = this.getFrames();
  }

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

  select(frame: FrameInfo | number) {
    const previous = this.current;
    this.current = typeof (frame) === "number" ? frame : frame.frame;

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
    this.selected.emit(this.index);
  }

  mouseDown: MouseEvent;
  offsets: number[] = [];

  @HostListener('mouseup', ['$event'])
  onMouseUp($event: MouseEvent) {
    delete this.mouseDown;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave($event: MouseEvent) {
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
      let multiplier = 10;

      if (Math.abs($event.clientY - this.mouseDown.clientY) > threshold && Math.abs($event.clientX - this.mouseDown.clientX) <= threshold) {
        const offset = this.mouseDown.clientY - $event.clientY;
        this.offsets.push(offset);
        
        if ($event.shiftKey)
          multiplier /= 2;
        const current = Math.min(this.stop - 2, Math.max(this.start, this.current + Math.floor(offset / multiplier)));
        this.select(current);
      }

      this.mouseDown = $event;
    }
  }
}
