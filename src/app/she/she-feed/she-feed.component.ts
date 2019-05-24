import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { SheFeedService } from '../she-feed.service';
import { Observable, of } from 'rxjs';
import { DayGroupedSheFeed, SheFeed } from '../she-feed.interface';
import { take, tap } from 'rxjs/operators';


import * as format from 'date-fns/format';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { SheFeedScrollingService } from './she-feed-scrolling.service';

@Component({
  selector: 'rum-she-feed',
  templateUrl: './she-feed.component.html',
  styleUrls: ['./she-feed.component.scss']
})
export class SheFeedComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('feedContainer') feedContainer: ElementRef;
  @ViewChildren('daySeparator', { read: ElementRef }) dateSeparators: QueryList<ElementRef>;
  @ViewChild(DaterangepickerDirective) pickerDirective: DaterangepickerDirective;

  public feed$: Observable<{ day: string; data: SheFeed[]; }[] >;
  public feedArray: DayGroupedSheFeed[];
  public feedSlicedArray: DayGroupedSheFeed[];

  private todayElement: any;
  private filteredData = false;
  private scrolled = false;
  private hideDatePicker = true;

  private dataFetched = false;
  private feedScrollingInit = false;
  private previousLength = 0;
  private monthStep = 1;
  private currentMonthStep = 0;
  private readonly today = format(new Date(), 'ddd DD MMM YYYY');
  private todayIndex = 0;
  private startIndex = 0;

  constructor(private sheFeedSvc: SheFeedService,
              private sheFeedScrollingSvc: SheFeedScrollingService) {
  }

  ngOnInit() {
    this.feedInit();
    this.scrolled = false;
  }

  ngOnDestroy(): void {
    this.scrolled = false;
  }

  ngAfterViewChecked() {
    this.findTodayElement();
  }

  /**
   * Initialise the feed
   * Checks if there is enough data to show then fetching more
   * Initialise the scrolling service and slices enough data to display
   */
  feedInit() {
    this.feed$ = this.sheFeedSvc.getInitFeed().pipe(tap((feed: DayGroupedSheFeed[]) => {
      this.feedArray = feed;
      if (!this.feedScrollingInit) {
        this.feedScrollingInit = true;
        this.todayIndex = feed.findIndex((value) => value.day === this.today);
        this.sheFeedScrollingSvc.init(this.todayIndex, feed.length);

        this.startIndex = this.todayIndex > 0 ? this.todayIndex - 1 : 0;
        this.feedSlicedArray = feed.slice(this.startIndex , this.startIndex + 3);
      } else {
        this.sheFeedScrollingSvc.setFeedLength(feed.length);
        this.pushMoreItems();
      }

      if ((feed.length < 15) && !this.dataFetched) {
        this.currentMonthStep += 3;
        this.monthStep = 3;
        if (feed.length === 0 && this.currentMonthStep > 11) {
          this.dataFetched = true;

          return;
        }

        this.sheFeedSvc.getMoreData(this.monthStep);
      } else {
        return;
      }
      this.previousLength = feed.length;
    }));
  }

  /**
   * When the user scrolling down and reach the minimun distance from the bottom
   * triggers this method to append more data
   */
  onScrollDown() {
    if (!this.filteredData) {
      this.pushMoreItems();
    }
  }

  /**
   * When the user scrolling up and reach the minimun distance from the top
   * triggers this method to append more data
   */
  onScrollUp() {
    if (!this.filteredData) {
      const scrollingUpIndexes = this.sheFeedScrollingSvc.onScrollingUp();
      if (scrollingUpIndexes.endDate >= 0) {
        const a = this.feedArray.slice(scrollingUpIndexes.startDate, scrollingUpIndexes.endDate);
        this.feedSlicedArray.unshift(...a);
      }
    }
  }

  /**
   * Pushes data from the parent array to the visible array
   */
  pushMoreItems() {
    const scrollingDownIndexes = this.sheFeedScrollingSvc.onScrollingDown();

    if (scrollingDownIndexes.startDate >= this.feedArray.length) {
      this.loadMoreData()
    } else {
      const a = this.feedArray.slice(scrollingDownIndexes.startDate , scrollingDownIndexes.endDate);
      this.feedSlicedArray.push(...a);
    }
  }

  /**
   * Searches on the Date elements, and finds the current date
   */
  findTodayElement() {
    if (this.dateSeparators && !this.scrolled) {
      const today = format(new Date(), 'ddd DD MMM YYYY');

      this.dateSeparators.changes.pipe(take(1)).subscribe((changes) => {
        this.todayElement = changes.find(item => {
          return item.nativeElement.textContent === today;
        });

        // TODO: Fix this hack. Material mat-sidenav component does not currently support programmatic scrolling
        // See https://github.com/angular/material2/issues/4280
        if (this.todayElement && !this.scrolled) {
          this.scrolled = true;

          document.querySelector('.mat-sidenav-content').scrollTop = this.todayElement.nativeElement.offsetTop;
        }
      });
    }
  }

  /**
   * When the user taps on the refresh button, initialise the feed
   */
  refreshFeedData() {
    this.feedSlicedArray = [];
    this.feedArray = [];

    this.filteredData = false;
    this.scrolled = false;
    this.feedScrollingInit = false;
    this.feedInit();
  }

  /**
   * When the user taps on the today button, scrolls to today
   */
  scrollToToday() {
    if (this.todayElement) {
      document.querySelector('.mat-sidenav-content').scrollTop = this.todayElement.nativeElement.offsetTop;
    } else {
      document.querySelector('.mat-sidenav-content').scrollTop = 0;
    }
  }

  /**
   * Getting more data from the server
   */
  loadMoreData() {
    this.sheFeedSvc.getMoreData(this.monthStep);
  }

  change(e) {
    console.log(e)
  }

  /**
   * Getting the dates from the date picker and makes an api call to display the data
   */
  selectedDates(e) {
    this.hideDatePicker = true;
    this.filteredData = true;

    const startDay = e.startDate.startOf('day').unix();
    const endDay = e.endDate.endOf('day').unix();

    this.feed$ = null;
    this.feed$ = this.sheFeedSvc.getFeedDataByTime(startDay, endDay).pipe(tap((feed: DayGroupedSheFeed[]) => {
      this.feedArray = feed;
      this.feedSlicedArray = feed;
    }));
    this.todayElement = null;
    document.querySelector('.mat-sidenav-content').scrollTop = 0;
  }

  /**
   * Opens the date picker when the user taps on the filter button
   */
  open(e) {
    this.hideDatePicker = !this.hideDatePicker;
  }
}
