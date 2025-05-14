import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/generic/config';
import { LocalStorageServices } from './auth.services/localStorage.Services';

import { CONFIG_LS_NAME } from '../models/generic/conts';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;
  private readonly _assetsConfig;
  private configUrl = 'assets/config/config.json';

  constructor(
    private http: HttpClient,
    private localStorageServices: LocalStorageServices,
    private encryptionService: EncryptionService
  ) {
    this._assetsConfig = 'assets/config/config.json';
  }

  async getAppConfig(): Promise<void> {
    try {
      console.log('ConfigService: Loading config from assets');
      if (!this.config?.urlApiBase) {
        await this.http
          .get<Config>(this.configUrl)
          .subscribe((res) => this._setStorage(res));
      }
      return;
    } catch (error) {
      console.error(`ConfigService: ${error}`);
    }
  }

  private _setStorage = (config: Config): void => {
    const encriptedConfig = this.encryptionService.encryptToken(
      JSON.stringify(config)
    );
    this.localStorageServices.setLocalData(CONFIG_LS_NAME, encriptedConfig);
  };

  get configValue(): Config {
    const encriptedConfig = localStorage.getItem(CONFIG_LS_NAME);
    if (encriptedConfig) {
      const storedData = this.encryptionService.decryptToken(encriptedConfig);
      this.config = storedData ? JSON.parse(storedData) : [];
    }

    return this.config ? this.config : new Config();
  }
}
