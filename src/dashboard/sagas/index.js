import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import * as deps from '../deps';

export function* saveDefaults(action) {
  yield put(deps.actions.saveSettingsRequested({
    someValue: 'This is a value saved in the database.',
  }, {
    name: 'google-analytics-app-extension-worona',
    siteId: action.siteId, // This is optional when editing a site.
  }));
}

export default function* testSagas() {
  yield [
    takeEvery(action => action.type === deps.types.DEFAULT_SETTINGS_NEEDED
      && action.name === 'google-analytics-app-extension-worona',
      saveDefaults),
  ];
}
