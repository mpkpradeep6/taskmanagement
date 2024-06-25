import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { TmHomeComponent } from '../tm-home/tm-home.component';
import { TmCreateComponent } from '../tm-create/tm-create.component';
import { TaskService } from '../services/task.service';
import { Subscription, filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TmLoginComponent } from '../tm-login/tm-login.component';

const components = [
  CommonModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  TmHomeComponent,
  TmCreateComponent,
  TmLoginComponent
];
@Component({
  selector: 'tm-nav',
  standalone: true,
  imports: [...components],
  templateUrl: './tm-nav.component.html',
  styleUrl: './tm-nav.component.scss'
})
export class TmNavComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  // fillerNav = Array.from({length: 5}, (_, i) => `Nav Item ${i + 1}`);
  selectedMenu = 'login';
  isLoginSuccess = false;
  fillerNav = [
    { label: 'Home', key: 'home', visible: () => this.isLoginSuccess },
    { label: 'Login', key: 'login', visible: () => !this.isLoginSuccess },
    { label: 'Logout', key: 'logout', visible: () => this.isLoginSuccess }
  ];

  fillerContent = Array.from(
    { length: 5 },
    () =>
      `Create`,
  );

  private _mobileQueryListener: () => void;
  private subscriptions: Subscription[] = [];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private router: Router,
    private readonly taskService: TaskService,
    // private readonly dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    // TODO: Call login in login component
    // this.taskService.login();
    this.subscriptions.push(this.taskService.loginStatus$.pipe(filter(f => !!f)).subscribe(val => {
      // this.isLoginSuccess = !!val?.login;
      this.isLoginSuccess = val.action === 'login' && val.status === 'success';
      if (this.isLoginSuccess) {
        this.selectedMenu = 'home';
      }
    }));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    while (this.subscriptions.length > 0) {
      this.subscriptions.pop()?.unsubscribe();
    }
  }

  onSelect($event: any) {
    this.selectedMenu = $event.key;
    if (this.selectedMenu === 'logout') {
      this.isLoginSuccess = false;
      this.selectedMenu = 'login';
    }
  }
}
