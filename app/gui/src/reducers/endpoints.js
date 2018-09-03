import { combineReducers } from 'redux';
import {
  FETCH_ENDPOINTS_REQUEST,
  FETCH_ENDPOINTS_SUCCESS,
  FETCH_ENDPOINTS_FAILURE,
} from '../actions/ActionTypes';

const byId = (state = [], action) => {
  switch (action.type) {
    case FETCH_ENDPOINTS_SUCCESS:
      return {
        ...state,
        ...action.entities.endpoints,
      };
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case FETCH_ENDPOINTS_SUCCESS:
      return action.result;
    default:
      return state;
  }
};

const loading = (state = false, action) => {
  switch (action.type) {
    case FETCH_ENDPOINTS_REQUEST:
      return true;
    case FETCH_ENDPOINTS_SUCCESS:
    case FETCH_ENDPOINTS_FAILURE:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds,
  loading,
});

export const getById = (state, id) => state.byId[id] || null;
export const getAllIds = state => state.allIds;
export const getDictionary = state => state.byId;
export const isLoading = state => state.loading;
