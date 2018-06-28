import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ProjectDetail } from '../pages/ProjectDetail';

const mapStateToProps = state => {
  return {
    preferences: state.preferences,
    projects: state.projects
  };
};

export const ProjectDetailContainer = withRouter(
  connect(
    mapStateToProps,
    null
  )(ProjectDetail)
);
