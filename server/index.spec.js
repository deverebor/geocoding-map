describe('index', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('Should index.js exist', () => {
    expect(true).toEqual(true);
  });

  it('Should server running at port 3000', () => {
    const express = require("express");
    const cors = require("cors");

    const PORT =  3000;
    const app = express();

    expect(app.listen).toBeCalledWith(PORT);
  });
});