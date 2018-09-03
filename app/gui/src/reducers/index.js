import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import endpoints, { getAllIds, getDictionary } from './endpoints';

export default combineReducers({
  endpoints,
});

export const getEndpoints = createSelector(
  [getAllIds, getDictionary],
  (ids, dictionary) => ids.map(id => dictionary[id])
);
