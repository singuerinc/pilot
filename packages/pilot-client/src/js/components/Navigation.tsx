import * as React from 'react';
import { Link } from 'react-router-dom';
import feather from 'feather-icons';
import Mousetrap from 'mousetrap';

interface Props {
  history;
}

export class Navigation extends React.Component<Props> {
  componentDidMount() {
    const { history } = this.props;

    Mousetrap.bind('g h', () => {
      history.push('/');
    });

    Mousetrap.bind('g s', () => {
      history.push('/settings');
    });
  }

  render() {
    return (
      <ul className="list ma0 pa0 bg-red br b--dark-red h-100">
        <li className="h3 flex items-center justify-center" style={{ width: '50px' }}>
          <Link
            to="/"
            className="dim near-black"
            dangerouslySetInnerHTML={{ __html: feather.icons.home.toSvg() }}
          />
        </li>
        <li className="h3 flex items-center justify-center" style={{ width: '50px' }}>
          <Link
            to="/settings"
            className="dim near-black"
            dangerouslySetInnerHTML={{ __html: feather.icons.settings.toSvg() }}
          />
        </li>
      </ul>
    );
  }
}
