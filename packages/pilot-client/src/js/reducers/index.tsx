import { append, filter } from 'ramda';
import { ADD_PROJECT, PREF_LAYOUT_MODE, REMOVE_PROJECT } from '../actions';
import { IProject } from './IProject';
import { Layout } from './Layout';

const pref = {
  layout: Layout.GRID
};

const initialState: IProject[] = [
  { name: 'Better DNI', pkg: 'better-dni' },
  { name: 'Overlay', pkg: 'overlay' }
];

const projects = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PROJECT:
      return [...append(action.payload, state)];
    case REMOVE_PROJECT:
      return [...filter(x => x.pkg !== action.payload, state)];
    default:
      return state;
  }
};

const preferences = (state = pref, action) => {
  switch (action.type) {
    case PREF_LAYOUT_MODE:
      return { ...state, layout: action.payload };
    default:
      return state;
  }
};
export default { preferences, projects };
