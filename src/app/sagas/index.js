/* eslint-disable no-undef */
import { takeEvery } from 'redux-saga';
import { select, take, fork, call } from 'redux-saga/effects';
import request from 'superagent';
import * as deps from '../deps';

export function* virtualPageView(siteName, siteUrl) {
  const query = yield select(deps.selectors.getURLQueries);

  if (query.p) {
    yield take(deps.types.POST_SUCCEED);
    yield call(sendPageView, siteName, siteUrl, 'posts', query.p);
  } else if (query.cat) {
    yield take(deps.types.NEW_POSTS_LIST_SUCCEED);
    yield call(sendPageView, siteName, siteUrl, 'categories', query.cat);
  } else if (query.tag) {
    yield take(deps.types.NEW_POSTS_LIST_SUCCEED);
    yield call(sendPageView, siteName, siteUrl, 'tags', query.tag);
  } else if (query.author) {
    yield take(deps.types.NEW_POSTS_LIST_SUCCEED);
    yield call(sendPageView, siteName, siteUrl, 'users', query.author);
  } else if (query.page_id) {
    yield take(deps.types.PAGE_SUCCEED);
    yield call(sendPageView, siteName, siteUrl, 'pages', query.page_id);
  } else if (query.s) {
    yield take(deps.types.NEW_POSTS_LIST_SUCCEED);
    yield call(sendPageView, siteName, siteUrl, 'searchs', query.s);
  } else if (query.attachment_id) {
    yield take(deps.types.POST_SUCCEED);
    yield call(sendPageView, siteName, siteUrl, 'media', query.attachment_id);
  } else {
    yield take(deps.types.NEW_POSTS_LIST_SUCCEED);
    yield call(sendPageView, siteName, siteUrl);
  }
}

export function* sendPageView(siteName, siteUrl, wpType, id) {
  let entity,
    title;

  console.log('PAGE VIEW', wpType, id);

  if (typeof wpType === 'string' && typeof id === 'string') {
    entity = yield select(deps.selectorCreators.getWpTypeById(wpType, id));
  }

  // Chooses the correct attribute for pageview's title
  switch (wpType) {
    case ('posts', 'pages', 'searchs'):
      title = `${entity.title.rendered} - ${siteName}`;
      break;
    case ('categories', 'tags', 'users', 'media'):
      title = `${entity.name} - ${siteName}`;
      break;
    default:
      title = `${siteName}`;
  }

  const entityUrl = entity ? new URL(entity.link) : new URL(siteUrl);

  const pageview = {
    hitType: 'pageview',
    title,
    page: entityUrl.pathname,
  };

  ga('clientTracker.send', pageview);

  console.log(pageview);
}

export default function* googleAnalyticsSagas() {
  // yield take(deps.types.SITE_ID_CHANGED);

  if (!window.ga) {
    console.log('Variable "ga" not initialized.');
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  } else {
    console.log('Variable "ga" already initialized.');
  }

  const siteUrl = yield select(deps.selectorCreators.getSetting('generalSite', 'url'));
  const { body } = yield call(request, `${siteUrl}/?rest_route=/`);
  const siteName = body.name;

  const firstView = yield fork(function* firstVirtualPageView() {
    const trackingId = yield select(
      deps.selectorCreators.getSetting('googleAnalytics', 'trackingId')
    );
    ga('create', trackingId, 'auto', 'clientTracker');
    console.log('Client Tracker created.', ga.getAll());

    yield call(virtualPageView, siteName, siteUrl);
  });

  yield takeEvery(deps.types.ROUTER_DID_CHANGE, virtualPageView, siteName, siteUrl);
}
