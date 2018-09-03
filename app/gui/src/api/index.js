import { client } from './client';

export const fetchEndpoints = () =>
  client.get('http://localhost:8045/api/http-endpoints');
