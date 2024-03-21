import {env} from "@/scripts/lib/utils/CommonUtils";

const commonConstants = {
  DEFAULT_LOCALE: 'vi',
  DEFAULT_LATITUDE: 10.7872923,
  DEFAULT_LONGITUDE: 106.6852646,
  URL_HITO_KINTAI: env('APP_HTIO_KINTAI_URL')
}
export default commonConstants;