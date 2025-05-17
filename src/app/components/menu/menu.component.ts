import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
  SESSION_LS_NAME,
  STORAGE_LS_ADMON,
  STORAGE_LS_USER,
  TOKEN_LS_NAME,
} from '../../models/generic/conts';
import { EncryptionService } from '../../services/encryption.service';
import { AuthServices } from '../../services/auth.services/auth.services';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  dataSent: any;
  user: string = '';
  name: string = '';
  role: string = '';
  isAdmin: boolean = true;

  constructor(
    private observer: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authServices: AuthServices,
    private encryptionService: EncryptionService
  ) {}
  ngOnInit(): void {
    // Leer el array del localStorage
    const encryptedSession = localStorage.getItem(SESSION_LS_NAME);
    if (encryptedSession) {
      const storedData = this.encryptionService.decryptToken(encryptedSession);
      this.dataSent = storedData ? JSON.parse(storedData) : [];
      this.user = this.dataSent.email;
      this.name = this.dataSent.name;
      this.role = this.dataSent.userTypeDescription;
      this.isAdmin = this.dataSent.userType == STORAGE_LS_ADMON;
    }
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((resp: any) => {
      if (resp.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
    this.cd.detectChanges();
  }

  logOut() {
    this.authServices.clearToken(TOKEN_LS_NAME);
    this.authServices.clearToken(SESSION_LS_NAME);
    this.authServices.clearToken(STORAGE_LS_USER);
    this.router.navigateByUrl('');
  }
}
