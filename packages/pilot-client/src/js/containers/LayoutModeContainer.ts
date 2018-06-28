import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import actions from '../actions';
import { LayoutMode } from '../pages/components/LayoutMode';

const mapDispatchToProps = dispatch => {
  return {
    changeToGridLayout: () => {
      dispatch(actions.preferences.changeToGridLayout());
    },
    changeToListLayout: () => {
      dispatch(actions.preferences.changeToListLayout());
    }
  };
};

export const LayoutModeContainer = withRouter(
  connect(
    null,
    mapDispatchToProps
  )(LayoutMode)
);
