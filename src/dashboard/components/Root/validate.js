export const messages = {
  required: 'Required',
  invalidTrackingId: 'Invalid Tracking ID. It should be something like UA-XXXX-YY, being XXXX a number of 4-9 digits and YY a number of 1-4 digits.',
};

const regexps = {
  trackingId: /^ua-\d{4,9}-\d{1,4}$/i,
};

export default values => {
  const errors = {};
  if (values) {
    if (!values.trackingId) {
      errors.trackingId = messages.required;
    } else if (!regexps.trackingId.test(values.trackingId)) {
      errors.trackingId = messages.invalidTrackingId;
    }
  }
  return errors;
};
