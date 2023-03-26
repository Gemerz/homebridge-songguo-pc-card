import axios from 'axios';
import { Service, Characteristic, Logger } from 'homebridge';
import { API } from '../const'
import { SongguoPCCardAccessoryConfig } from '../accessory'


// https://developers.homebridge.io/#/characteristic/Active
export function add(
  service: Service,
  conifg: SongguoPCCardAccessoryConfig,
  characteristic: typeof Characteristic.On,
  log: Logger
) {
  const { username, password, name } = conifg;
  return service
    .getCharacteristic(characteristic)
    .onGet(async () => {
      const res = await axios({
        method: 'post',
        url: API,
        data: {
          "sgdz_account": username,
          "sgdz_password": password,
          "device_name": name,
          "value": "11"
        }
      });
      const result = Number(res.data.status) === 1 ? 1 : 0;
      log.info(`${name} current status is ${result === 1 ? 'on' : 'off'}`);
      return result;
    })
    .onSet(async function (value) {
      log.info(`${name} onSet pre status is ${value}`);
      const newStatus = value ? 1 : 0;
      await axios({
        method: 'post',
        url: API,
        data: {
          "sgdz_account": username,
          "sgdz_password": password,
          "device_name": name,
          "value": newStatus
        }
      });
    });
}
