/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import * as deps from '../../deps';
import Form from './Form.jsx';

export default () => {
  const RootContainer = deps.elements.RootContainer;
  return (
    <RootContainer mobilePreview>
      <h1 className="title">Google Analytics</h1>
      <hr />
      <Form />
    </RootContainer>
  );
};
