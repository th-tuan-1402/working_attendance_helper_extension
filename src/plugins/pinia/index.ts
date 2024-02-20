import { createPinia } from 'pinia'
const store = createPinia()

import useLocalStorage from './localStorage';
store.use(useLocalStorage);

export default store;