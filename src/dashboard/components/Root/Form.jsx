/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { flow } from 'lodash/fp';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import validate from './validate';
import * as deps from '../../deps';

const Form = ({ handleSubmit, pristine, siteId, waiting, invalid, anyTouched, useCustomDim }) =>
  <form
    onSubmit={handleSubmit((values, dispatch) =>
      dispatch(
        deps.actions.saveSettingsRequested(values, {
          siteId,
          name: 'google-analytics-app-extension-worona',
        })
      )
    )}
  >
    <Field
      name="trackingId"
      label="Tracking ID"
      component={deps.elements.Input}
      type="text"
      size="medium"
      className="is-medium"
    />
    <br />
    <hr />
    <Field
      name="useCustomDim"
      component={deps.elements.Switch}
      label="Use a custom dimension?"
      type="checkbox"
    />
    <div className="columns">
      <div className="column is-12-mobile is-6-tablet is-4-desktop">
        <Field
          name="dimensionId"
          label="Dimension's index"
          component={deps.elements.Input}
          type="text"
          size="medium"
          disabled={!useCustomDim}
        />
        <span className="help">
          The index of your custom dimension assigned by Google Analytics.
        </span>
      </div>
      <div className="column is-12-mobile is-6-tablet is-8-desktop">
        <Field
          name="dimensionValue"
          label="Dimension's value"
          component={deps.elements.Input}
          type="text"
          size="medium"
          disabled={!useCustomDim}
        />
        <span className="help">
          Value to be assigned to your custom dimension that will be sent into your pageviews.
        </span>
      </div>
    </div>
    <br />

    <deps.elements.Button
      color="primary"
      size="large"
      type="submit"
      disabled={waiting || pristine || (invalid && anyTouched)}
      loading={waiting}
    >
      Save
    </deps.elements.Button>
    <hr />
    <article className="message is-primary">
      <div className="message-header">
        <p>Not familiar with Google Analytics?</p>
      </div>
      <div className="message-body">
        Follow our{' '}
        <a href="https://docs.worona.org/dashboard/extensions/google-analytics.html">
          documentation
        </a>{' '}
        to learn where to find your Analytics tracking ID and how to collect data with custom
        dimensions.
      </div>
    </article>
  </form>;
Form.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  waiting: React.PropTypes.bool,
  siteId: React.PropTypes.string,
  pristine: React.PropTypes.bool,
  invalid: React.PropTypes.bool,
  anyTouched: React.PropTypes.bool,
  useCustomDim: React.PropTypes.bool,
  initialValues: React.PropTypes.shape({
    trackingId: React.PropTypes.string,
    useCustomDim: React.PropTypes.bool,
    dimensionId: React.PropTypes.string,
    dimensionValue: React.PropTypes.string,
  }),
};

const formSelector = formValueSelector('GoogleAnalyticsForm', state => state.theme.reduxForm);

const mapStateToFormProps = state => ({
  initialValues: {
    trackingId: deps.selectorCreators.getSetting('googleAnalytics', 'trackingId')(state),
    useCustomDim: deps.selectorCreators.getSetting('googleAnalytics', 'useCustomDim')(state),
    dimensionId: deps.selectorCreators.getSetting('googleAnalytics', 'dimensionId')(state),
    dimensionValue: deps.selectorCreators.getSetting('googleAnalytics', 'dimensionValue')(state),
  },
  waiting: deps.selectors.getSavingSettings(state) === 'google-analytics-app-extension-worona',
  useCustomDim: formSelector(state, 'useCustomDim'),
});

export default flow(
  reduxForm({
    form: 'GoogleAnalyticsForm',
    getFormState: state => state.theme.reduxForm,
    enableReinitialize: true,
    validate,
  }),
  connect(mapStateToFormProps)
)(Form);
