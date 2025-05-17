import { Component } from '@angular/core';
import { Config } from './models/generic/config';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'PetSoft.App';

  configData!: Config;

  ngAfterViewInit() {
    this.loadConfig();
  }

  constructor(private readonly configService: ConfigService) {}

  async loadConfig() {
    await this.configService.getAppConfig();
    this.configData = this.configService.configValue;
  }
}
