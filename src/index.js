import 'whatwg-fetch';
import './index.scss';
import React from 'react';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('app'),
);

if ('serviceWorker' in navigator) {
  const registration = runtime.register();
}

if (module.hot) {
  module.hot.accept();
}
