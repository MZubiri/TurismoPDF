import { Component, inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule, MatDrawerMode } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private breakpointSub?: Subscription;

  isMobile = false;
  sidenavMode: MatDrawerMode = 'side';
  isOpened = true;

  ngOnInit() {
    this.breakpointSub = this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.sidenavMode = 'over';
          this.isOpened = false;
        } else {
          this.sidenavMode = 'side';
          this.isOpened = true;
        }
      });
  }

  ngOnDestroy() {
    this.breakpointSub?.unsubscribe();
  }

  onNavItemClick(sidenav: any) {
    if (this.isMobile) {
      sidenav.close();
    }
  }

  logout() {
    this.authService.logout();
  }
}