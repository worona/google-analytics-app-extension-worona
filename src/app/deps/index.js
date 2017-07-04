import { dep } from 'worona-deps';

export const types = {
  get SITE_ID_CHANGED() { return dep('router', 'types', 'SITE_ID_CHANGED'); },
  get ROUTER_DID_CHANGE() { return dep('router', 'types', 'ROUTER_DID_CHANGE'); },
  get APP_SETTINGS_SUCCEED() { return dep('settings', 'types', 'APP_SETTINGS_SUCCEED'); },
  get POST_SUCCEED() { return dep('connection', 'types', 'POST_SUCCEED'); },
  get PAGE_SUCCEED() { return dep('connection', 'types', 'PAGE_SUCCEED'); },
  get NEW_POSTS_LIST_SUCCEED() { return dep('connection', 'types', 'NEW_POSTS_LIST_SUCCEED'); },
};

export const selectors = {
  get getURLQueries() { return dep('router', 'selectors', 'getURLQueries'); },
};

export const selectorCreators = {
  get getSetting() {
    return dep('settings', 'selectorCreators', 'getSetting');
  },
  get getWpTypeById() {
    return dep('connection', 'selectorCreators', 'getWpTypeById');
  },
};
