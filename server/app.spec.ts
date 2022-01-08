import { mockData } from './helpers/mock';

describe('index', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('Should index.js exist', () => {
    const express = require("express");
    const app = express();

    app.use('/api/search/', require('./routes/search/search'));

    expect(app).toBeDefined();
  });

  it('Should server running at port 3000', () => {
    const express = require("express");
    const app = express();

    app.use('/api/search/', require('./routes/search/search'));

    expect(app.listen).toBeDefined();
  });

  it('Should make one search on api', () => {
    const express = require("express");
    const app = express();
    app.use('/api/search/', require('./routes/search/search'));

    const axios = require('axios');
    const response = axios.get('http://localhost:3000/api/search/', {
      params: {
        access_token: mockData.access_token,
        query: mockData.query,
      }
    });

    expect(response).toBeDefined();
  })
});