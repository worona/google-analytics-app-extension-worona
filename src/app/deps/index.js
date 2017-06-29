import { dep } from 'worona-deps';

export const types = {
  get SITE_ID_CHANGED() { return dep('router', 'types', 'SITE_ID_CHANGED'); },
  get ROUTER_DID_CHANGE() { return dep('router', 'types', 'ROUTER_DID_CHANGE'); },
  get APP_SETTINGS_SUCCEED() { return dep('settings', 'types', 'APP_SETTINGS_SUCCEED'); },
}

export const selectorCreators = {
  get getSetting() {
    return dep('settings', 'selectorCreators', 'getSetting');
  },
  get getWpTypeById() {
    return dep('connection', 'selectorCreators', 'getWpTypeById');
  },
};
