import { LayoutMode } from '../pages/components/LayoutMode';
import { Layout } from '../reducers/Layout';

export const ADD_PROJECT = 'ADD_PROJECT';
export const REMOVE_PROJECT = 'REMOVE_PROJECT';
export const PREF_LAYOUT_MODE = 'PREF_LAYOUT_MODE';

export default {
  preferences: {
    changeToGridLayout: () => ({
      type: PREF_LAYOUT_MODE,
      payload: Layout.GRID
    }),
    changeToListLayout: () => ({
      type: PREF_LAYOUT_MODE,
      payload: Layout.LIST
    })
  },
  project: {
    add: (name, pkg) => {
      return {
        type: ADD_PROJECT,
        payload: { name, pkg }
      };
    },
    remove: _id => {
      return { type: REMOVE_PROJECT, payload: _id };
    }
  }
};
