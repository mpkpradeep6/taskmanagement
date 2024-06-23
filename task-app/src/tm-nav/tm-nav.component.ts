import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { TmHomeComponent } from '../tm-home/tm-home.component';
import { TmCreateComponent } from '../tm-create/tm-create.component';

const components = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  TmHomeComponent,
  TmCreateComponent
];
@Component({
  selector: 'tm-nav',
  standalone: true,
  imports: [...components],
  templateUrl: './tm-nav.component.html',
  styleUrl: './tm-nav.component.scss'
})
export class TmNavComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  // fillerNav = Array.from({length: 5}, (_, i) => `Nav Item ${i + 1}`);
  selectedMenu = 'create';
  fillerNav = [
    { label: 'Home', key: 'read' },
    { label: 'Create', key: 'create' },
    { label: 'Update', key: 'update' },
    { label: 'Delete', key: 'delete' }
  ];

  fillerContent = Array.from(
    { length: 5 },
    () =>
      `Create`,
  );

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onSelect($event: any) {
    console.log($event);
    // this.router.navigate([$event.key]);
    this.selectedMenu = $event.key;
  }
}
