import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from '../../layout/dialog.service';
import { MapBoxComponent } from '../../layout/map-box/map-box.component';

@Component({
  selector: 'rump-twitter-view',
  templateUrl: './twitter-view.component.html',
  styleUrls: ['./twitter-view.component.scss']
})
export class TwitterViewComponent implements OnInit {

  @Input() item: any;

  constructor(private dialogSvc: DialogService) { }

  ngOnInit() {
  }

  showMapModal(location) {
    this.dialogSvc.createDialog<MapBoxComponent>(MapBoxComponent, {
      datapoints: [location]
    });
  }

}
