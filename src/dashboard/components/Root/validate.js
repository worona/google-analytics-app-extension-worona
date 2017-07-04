export const messages = {
  required: 'Required',
  invalidTrackingId:
    'Invalid Tracking ID. It should be something like UA-XXXX-YY, being XXXX a number of 4-9 digits and YY a number of 1-4 digits.',
  invalidDimensionId: 'Invalid index. It should be a number of 1-4 digits.',
  invalidDimensionValue: 'This field cannot be empty.',
};

const regexps = {
  trackingId: /^ua-\d{4,9}-\d{1,4}$/i,
  dimensionId: /^\d{1,4}$/i,
  dimensionValue: /^.+$/,
};

export default values => {
  const errors = {};
  if (values) {
    // Tests trackingId
    if (!values.trackingId) {
      errors.trackingId = messages.required;
    } else if (!regexps.trackingId.test(values.trackingId)) {
      errors.trackingId = messages.invalidTrackingId;
    }

    // Tests dimensionId
    if (values.useCustomDim && !regexps.dimensionId.test(values.dimensionId)) {
      errors.dimensionId = messages.invalidDimensionId;
    }

    // Tests dimensionValue
    // debugger
    if (
      values.useCustomDim &&
      (typeof values.dimensionValue !== 'string' ||
        !regexps.dimensionValue.test(values.dimensionValue))
    ) {
      errors.dimensionValue = messages.invalidDimensionValue;
    }
  }
  return errors;
};
