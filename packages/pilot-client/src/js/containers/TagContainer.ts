import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tag } from '../pages/components/Tag';

const mapStateToProps = state => {
  return {
    preferences: state.preferences
  };
};

export const TagContainer = withRouter(
  connect(
    mapStateToProps,
    null
  )(Tag)
);
