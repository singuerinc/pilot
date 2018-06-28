import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../actions';
import { Settings } from '../pages/Settings';

const mapStateToProps = state => {
  return {
    projects: state.projects
  };
};

const mapDispatchToProps = dispatch => {
  return {
    add: (name, pkg) => {
      dispatch(actions.project.add(name, pkg));
    },
    remove: _id => {
      dispatch(actions.project.remove(_id));
    }
  };
};
export const SettingsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Settings)
);
