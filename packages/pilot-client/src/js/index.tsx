import * as React from 'react';
import { render } from 'react-dom';
import 'tachyons';
import '../css/app.css';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { App } from './App';
import { history, configureStore } from './store';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { loadState, saveState } from './localStorage';

const client = new ApolloClient({ uri: 'http://localhost:3000/graphql' });
const preservedState = loadState();
const store = configureStore(preservedState);

store.subscribe(() => {
  saveState(store.getState());
});

render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('app')
);
