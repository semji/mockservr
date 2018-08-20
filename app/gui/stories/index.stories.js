import React from 'react';

import { storiesOf } from '@storybook/react';

import ThemeWrapper from '../src/components/ThemeWrapper';
import App from '../src/containers/App';

storiesOf('Test', module)
  .addDecorator(story => <ThemeWrapper>{story()}</ThemeWrapper>)
  .add('default', () => <App />);
