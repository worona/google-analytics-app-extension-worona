import { dep } from 'worona-deps';

export const elements = {
  get RootContainer() {
    return dep('theme', 'elements', 'RootContainer');
  },
  get Button() {
    return dep('theme', 'elements', 'Button');
  },
  get Input() {
    return dep('theme', 'elements', 'Input');
  },
};

export const actions = {
  get saveSettingsRequested() {
    return dep('settings', 'actions', 'saveSettingsRequested');
  },
};

export const selectorCreators = {
  get getSetting() {
    return dep('settings', 'selectorCreators', 'getSetting');
  },
};

export const selectors = {
  get getSavingSettings() {
    return dep('settings', 'selectors', 'getSavingSettings');
  },
};

export const types = {
  get DEFAULT_SETTINGS_NEEDED() {
    return dep('settings', 'types', 'DEFAULT_SETTINGS_NEEDED');
  },
};
