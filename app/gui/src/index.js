import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './configureStore';
import Root from './containers/Root';

const store = configureStore();

registerServiceWorker();

const render = () => {
  ReactDOM.render(
    <Root store={store}>
      <App />
    </Root>,
    document.getElementById('root')
  );
};

render();

module.hot && module.hot.accept('./containers/App', render);
