import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../actions';
import { Home } from '../pages/Home';

const mapStateToProps = state => {
  return {
    projects: state.projects
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {}
  };
};
export const HomeContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
