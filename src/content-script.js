import api from './scripts/api/hitoApi'
import ChromeHelper from './helpers/ChromeHelper';
import HitoController from './controllers/HitoController';
import { install } from './plugin/axios';

const chromeHelper = new ChromeHelper(chrome);
const axios = install({ chromeHelper })
const controller = new HitoController({ api, axios, chromeHelper });

(async () => {
  controller.loop()
})()