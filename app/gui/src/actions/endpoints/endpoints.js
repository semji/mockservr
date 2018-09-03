import { normalize } from 'normalizr';
import { endpoint } from '../../schemas';
import {
  FETCH_ENDPOINTS_REQUEST,
  FETCH_ENDPOINTS_SUCCESS,
} from '../ActionTypes';
import * as api from '../../api';

export const fetchEndpoints = ({ initialFetch = false } = {}) => dispatch => {
  dispatch({
    type: FETCH_ENDPOINTS_REQUEST,
    initialFetch,
  });

  return api.fetchEndpoints().then(endpoints => {
    dispatch({
      type: FETCH_ENDPOINTS_SUCCESS,
      ...normalize(endpoints, [endpoint]),
    });
  });
};
