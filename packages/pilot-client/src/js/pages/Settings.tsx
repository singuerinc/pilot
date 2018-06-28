import * as React from 'react';
import { map } from 'ramda';
import { IProject } from '../reducers/IProject';
import feather from 'feather-icons';
import { AddProjectForm } from './components/AddProjectForm';

const LiProject = ({ name, pkg, remove }) => {
  return (
    <li>
      {name} / {pkg}
      <a href="#" onClick={remove} dangerouslySetInnerHTML={{ __html: feather.icons.x.toSvg() }} />
    </li>
  );
};

interface Props {
  projects: IProject[];
  add: (add, pkg) => {};
  remove: (pkg) => {};
}

export class Settings extends React.Component<Props> {
  render() {
    const { projects, add, remove } = this.props;
    return (
      <div className="ma4 flex-wrap">
        <div className="f1 title mb3">Settings</div>
        <div className="f3 subtitle mb3">Packages</div>
        <ul className="list ma0 pa0">
          {map(x => <LiProject key={x.pkg} {...x} remove={() => remove(x.pkg)} />, projects)}
        </ul>
        <AddProjectForm add={add} />
      </div>
    );
  }
}
