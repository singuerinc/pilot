import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Contributors } from '../components/Contributors';

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};
export const ContributorsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Contributors)
);
