import * as R from 'ramda';
import { Project } from './components/Project';

const findProj = ([projects, { params }]) =>
  R.find(x => x.pkg === decodeURIComponent(params.pkg), projects);

export const ProjectDetail = R.compose(
  Project,
  findProj,
  R.props(['projects', 'match'])
);
