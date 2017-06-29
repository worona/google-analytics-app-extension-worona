/* eslint-disable no-undef */
import { takeEvery } from 'redux-saga';
import { select, take, fork, call } from 'redux-saga/effects';
import request from 'superagent';
// import Mixpanel from 'mixpanel';
import * as deps from '../deps';

export function* virtualPageView(siteUrl, siteName) {
  const query = yield select(deps.selectors.getURLQueries);
  let entity;
  if (query.p) {
    // The Beauties of Gullfoss – Demo Worona
    entity = yield select(deps.selectorCreators.getWpTypeById('posts', query.p));
  } else if (query.cat) {
    // Culture – Demo Worona
    entity = yield select(deps.selectorCreators.getWpTypeById('queries', query.cat));
  } else if (query.tag) {
    // Tag – Demo Worona
    entity = yield select(deps.selectorCreators.getWpTypeById('tags', query.tag));
  } else if (query.author) { // users
    // Alan Martin - Demo Worona
    entity = yield select(deps.selectorCreators.getWpTypeById('users', query.author));
  } else if (query.page_id) { // pages
    // Page - Demo Worona
    entity = yield select(deps.selectorCreators.getWpTypeById('pages', query.page_id));
  } else if (query.s) { // search
    // Search Results for “beauties” – Demo Worona
    entity = yield select(deps.selectorCreators.getWpTypeById('searchs', query.s));
  } else if (query.attachment_id) { // media
    entity = yield select(deps.selectorCreators.getWpTypeById('media', query.attachment_id));
  } else {
    // Demo Worona - Just another WordPress site
  }

  let title = entity ? `${entity.title.rendered} - ${siteName}` : `${siteName}`;
  let entityUrl = entity ? new URL(entity.url) : new URL(siteUrl);

  ga('send', {
    hitType: 'pageview',
    title: title,
    page: entityUrl.pathname
  });
}

export default function* googleAnalyticsSagas() {
  yield take(deps.types.SITE_ID_CHANGED);

  if (!window.ga) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  }


  yield [
    fork(function* firstVirtualPageView() {
      yield take(deps.types.APP_SETTINGS_SUCCEED);

      const siteUrl = yield select(deps.selectorCreators.getSetting('generalSite', 'url'));
      const { body } = yield call(request, `${siteUrl}/?rest_url=/`);
      const siteName = body.name;

      const trackingId = yield select(deps.selectorCreators.getSetting('googleAnalytics', 'trackingId'));
      ga('create', trackingId, 'auto', 'clientTracker');

      yield call(virtualPageView, siteUrl, siteName);
    }),

    takeEvery(deps.types.ROUTER_DID_CHANGE, virtualPageView),
  ];
}
