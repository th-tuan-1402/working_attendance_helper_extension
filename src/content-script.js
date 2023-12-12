import HitoController from './controllers/HitoController';
import api from './scripts/api/hitoApi'

const controller = new HitoController(api);

(async () => {
  controller.loop()
})()