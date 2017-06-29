/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { flow } from 'lodash/fp';
import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import * as deps from '../../deps';

const Form = ({ handleSubmit, pristine, siteId, waiting, invalid, anyTouched }) => (
  <form
    onSubmit={handleSubmit((values, dispatch) =>
      dispatch(
        deps.actions.saveSettingsRequested(values, {
          siteId,
          name: 'google-analytics-app-extension-worona',
        }),
      ))}
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
        <p>
          Where do I find my Google Analytics Tracking ID?
        </p>
      </div>
      <div className="message-body">
        Here a brief explanation of how to do that.
      </div>
    </article>
  </form>
);
Form.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  waiting: React.PropTypes.bool,
  siteId: React.PropTypes.string,
  pristine: React.PropTypes.bool,
  invalid: React.PropTypes.bool,
  anyTouched: React.PropTypes.bool,
  initialValues: React.PropTypes.shape({
    trackingId: React.PropTypes.string,
  }),
};

const mapStateToFormProps = state => ({
  initialValues: {
    trackingId: deps.selectorCreators.getSetting('googleAnalytics', 'trackingId')(state),
  },
  waiting: deps.selectors.getSavingSettings(state) === 'google-analytics-app-extension-worona',
});

export default flow(
  reduxForm({
    form: 'GoogleAnalyticsForm',
    getFormState: state => state.theme.reduxForm,
    enableReinitialize: true,
    validate,
  }),
  connect(mapStateToFormProps),
)(Form);
