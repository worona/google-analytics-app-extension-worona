/* eslint-disable no-undef */
import { takeEvery } from 'redux-saga';
import { select, take, fork, call } from 'redux-saga/effects';
import request from 'superagent';
import * as deps from '../deps';

export function* virtualPageView(siteName, siteUrl) {
  const query = yield select(deps.selectors.getURLQueries);

  const wpTypeSucceed = (actionType, id) => action =>
    action.type === actionType && action.id === id;

  const currentListSucceed = () => action =>
    action.type === deps.types.NEW_POSTS_LIST_SUCCEED && action.name === 'currentList';

  if (query.p) {
    yield take(wpTypeSucceed(deps.types.POST_SUCCEED, query.p));
    yield call(sendPageView, siteName, siteUrl, 'posts', query.p);
  } else if (query.cat) {
    yield take(currentListSucceed());
    yield call(sendPageView, siteName, siteUrl, 'categories', query.cat);
  } else if (query.tag) {
    yield take(currentListSucceed());
    yield call(sendPageView, siteName, siteUrl, 'tags', query.tag);
  } else if (query.author) {
    yield take(currentListSucceed());
    yield call(sendPageView, siteName, siteUrl, 'users', query.author);
  } else if (query.page_id) {
    yield take(wpTypeSucceed(deps.types.PAGE_SUCCEED, query.page_id));
    yield call(sendPageView, siteName, siteUrl, 'pages', query.page_id);
  } else if (query.s) {
    yield take(currentListSucceed());
    yield call(sendPageView, siteName, siteUrl, 'searchs', query.s);
  } else if (query.attachment_id) {
    yield take(wpTypeSucceed(deps.types.POST_SUCCEED, query.attachment_id));
    yield call(sendPageView, siteName, siteUrl, 'media', query.attachment_id);
  } else {
    yield take(currentListSucceed());
    yield call(sendPageView, siteName, siteUrl);
  }
}

export function* sendPageView(siteName, siteUrl, wpType, id) {
  let entity,
    title;

  if (typeof wpType === 'string' && typeof id === 'string') {
    entity = yield select(deps.selectorCreators.getWpTypeById(wpType, id));
  }

  // Chooses the correct attribute for pageview's title
  switch (wpType) {
    case 'posts':
    case 'pages':
    case 'searchs':
      title = `${entity.title.rendered} - ${siteName}`;
      break;
    case 'categories':
    case 'tags':
    case 'users':
    case 'media':
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
}

export default function* googleAnalyticsSagas() {
  if (!window.ga) {
    (function (i, s, o, g, r, a, m) {
      i.GoogleAnalyticsObject = r;
      (i[r] =
        i[r] ||
        function () {
          (i[r].q = i[r].q || []).push(arguments);
        }), (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    }(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'));
  }

  const siteUrl = yield select(deps.selectorCreators.getSetting('generalSite', 'url'));
  const { body } = yield call(request, `${siteUrl}/?rest_route=/`);
  const siteName = body.name;

  const firstView = yield fork(function* firstVirtualPageView() {
    const trackingId = yield select(
      deps.selectorCreators.getSetting('googleAnalytics', 'trackingId')
    );
    ga('create', trackingId, 'auto', 'clientTracker');

    yield call(virtualPageView, siteName, siteUrl);
  });

  yield takeEvery(deps.types.ROUTER_DID_CHANGE, virtualPageView, siteName, siteUrl);
}
