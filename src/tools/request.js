import axios from 'axios';
import { baseURL } from '../../config';

const instance = axios.create({
  baseURL,
  timeout: 10e4,
});

// Add a request interceptor
instance.interceptors.request.use(
  config => config,
  error => Promise.reject(error),
);

// Add a response interceptor
instance.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error),
);

export default instance;
