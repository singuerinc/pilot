import feather from 'feather-icons';
import Mousetrap from 'mousetrap';
import * as React from 'react';

interface Props {
  changeToGridLayout: () => void;
  changeToListLayout: () => void;
}

export class LayoutMode extends React.Component<Props> {
  changeToGridLayout = event => {
    event && event.preventDefault();
    this.props.changeToGridLayout();
  };

  changeToListLayout = event => {
    event && event.preventDefault();
    this.props.changeToListLayout();
  };
  componentDidMount() {
    Mousetrap.bind('g g', () => {
      this.changeToGridLayout(null);
    });

    Mousetrap.bind('g l', () => {
      this.changeToListLayout(null);
    });
  }

  render() {
    return (
      <div className="w-100">
        <ul className="list mt2 ph4 pv2 w-100 tr">
          <div className="dib">
            <a
              className="ph2 dim dark-red"
              href="#"
              onClick={this.changeToGridLayout}
              dangerouslySetInnerHTML={{ __html: feather.icons.grid.toSvg() }}
            />
          </div>
          <div className="dib">
            <a
              className="ph2 dim dark-red"
              href="#"
              onClick={this.changeToListLayout}
              dangerouslySetInnerHTML={{ __html: feather.icons.list.toSvg() }}
            />
          </div>
        </ul>
      </div>
    );
  }
}
