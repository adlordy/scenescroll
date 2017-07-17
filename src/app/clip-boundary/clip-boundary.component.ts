import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClipService } from "../clip.service";

@Component({
  selector: 'clip-boundary',
  templateUrl: './clip-boundary.component.html',
  styleUrls: ['./clip-boundary.component.css']
})
export class ClipBoundaryComponent implements OnInit {
  constructor(private clipService: ClipService) {
    this.clipService.clipChanged$.subscribe(clip => {
      this.isStart = clip.start === this.frame;
      this.isStop = clip.stop === this.frame;
    });
  }

  @Input()
  frame: number;

  isStart = false;
  isStop = false;

  @Output()
  selected = new EventEmitter<number>();

  ngOnInit() {

  }

  select() {
    this.selected.emit(this.frame);
    this.clipService.clip(this.frame);
  }
}
