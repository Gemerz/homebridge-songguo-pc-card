import {
  API,
  Logger,
  Service,
  AccessoryConfig,
  AccessoryPlugin,
} from 'homebridge';

import { add as addActive } from './characteristics/active';


export interface SongguoPCCardAccessoryConfig extends AccessoryConfig {
  username: string;
  password: string;
}

export const isDefined = <T>(value: T): value is NonNullable<T> =>
  value !== null;

function isValidConfig(
  config: AccessoryConfig,
): config is SongguoPCCardAccessoryConfig {
  return !!config.username && !!config.password;
}

export class SongguoPCCardAccessory implements AccessoryPlugin {
  private readonly name?: string;
  protected readonly config?: SongguoPCCardAccessoryConfig;
  private readonly cardService?: Service;
  private readonly accessoryInformationService?: Service;
  constructor(
    protected readonly log: Logger,
    config: AccessoryConfig,
    protected readonly api: API,
  ) {
    if (isValidConfig(config)) {
      this.config = config;

      const {
        Service:{
          Switch,
          AccessoryInformation,
        },
        Characteristic,
      } = api.hap;

      this.name = config.name;
      this.cardService = new Switch(this.name);
      addActive(
        this.cardService,
        this.config,
        Characteristic.On,
        log,
      );
      this.accessoryInformationService = new AccessoryInformation().setCharacteristic(
        Characteristic.Manufacturer,
        'Song Guo Yun',
      );
    }
  }

  identify?(): void {
    this.log.info(`Identifying "${this.name}" @ ${this.config?.username}`);
  }

  getServices(): Service[] {
    return [
      this.cardService,
      this.accessoryInformationService,
    ].filter(isDefined);
  }
}
