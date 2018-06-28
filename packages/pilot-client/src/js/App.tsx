import * as React from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomeContainer } from './containers/HomeContainer';
import { ProjectDetailContainer } from './containers/ProjectDetailContainer';
import { SettingsContainer } from './containers/SettingsContainer';

const Nav = withRouter(Navigation);

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="flex h-100">
          <Nav />
          <Route exact path="/" component={HomeContainer} />
          <Route path="/project/:pkg" component={ProjectDetailContainer} />
          <Route path="/settings" component={SettingsContainer} />
        </div>
      </Router>
    );
  }
}

export { App };
