import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
} from '@angular/core';
import { getRandomColor } from './color.helper';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [NgStyle],
})
export class AppComponent implements DoCheck, OnInit, AfterViewInit {
  style = { 'background-color': 'red' };
  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private element: ElementRef
  ) {}
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.listen(
        this.element.nativeElement,
        'click',
        this.repaintWithManualCd.bind(this)
      );
    });
  }
  ngOnInit(): void {
    this.ngZone.onUnstable.subscribe(() => {
      console.log('zone became unstable');
    });
    this.ngZone.onStable.subscribe(() => {
      console.log('zone became stable');
      console.log('********************');
    });
    this.ngZone.onMicrotaskEmpty.subscribe(() => {
      console.log('No more micro tasks');
    });
    this.ngZone.onError.subscribe((err) => {
      console.log('Error encountered in zone', err);
    });
    console.log('Normal 1');
    setTimeout(() => {
      console.log('setTimeout 1');
      Promise.resolve().then(() => {
        console.log('Promise 2');
        this.repaintWithManualCd();
      });
    });
    setTimeout(() => {
      console.log('setTimeout 2');
    });
    Promise.resolve().then(() => {
      console.log('Promise 1');
    });
    requestAnimationFrame(() => {
      console.log('Animation 1');
    });
    requestAnimationFrame(() => {
      console.log('Animation 2');
    });
  }
  ngDoCheck(): void {
    console.log('do check');
  }
  repaint() {
    // console.log('outside run ', NgZone.isInAngularZone());
    // this.ngZone.runTask(() => {
    this.style = { 'background-color': getRandomColor() };
    // this.element.nativeElement.test.name = 1;
    console.log('inside run ', NgZone.isInAngularZone());
    // });
  }

  repaintWithManualCd() {
    this.repaint();
    this.cdr.markForCheck();
  }
  paint() {
    console.log('inside paint ', NgZone.isInAngularZone());
  }
}
