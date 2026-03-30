'use strict';

// Reusable mock req/res/next factory
const mockRes = () => {
  const res = {};
  res.statusCode = 200;
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  res.download = (filePath, name) => { res.downloadPath = filePath; res.downloadName = name; };
  return res;
};

const mockReq = ({ body = {}, user = null, params = {}, query = {}, file = null } = {}) => ({
  body,
  user,
  params,
  query,
  file,
});

const mockNext = () => {
  const fn = () => { fn.called = true; };
  fn.called = false;
  return fn;
};

// Inject a value into require cache before controller is loaded
const injectMock = (modulePath, mock) => {
  const resolved = require.resolve(modulePath);
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: mock,
  };
};

const clearMock = (modulePath) => {
  delete require.cache[require.resolve(modulePath)];
};

// Creates a chainable thenable query mock (mimics Mongoose Query behaviour).
// `resolveValue` is what `await query` returns.
// Optional `chain` object adds extra chainable methods.
const mockQuery = (resolveValue) => {
  const query = {
    select: function () { return this; },
    populate: function () { return this; },
    sort: function () { return this; },
    then: function (resolve, reject) {
      return Promise.resolve(resolveValue).then(resolve, reject);
    },
    catch: function (reject) {
      return Promise.resolve(resolveValue).catch(reject);
    },
  };
  return query;
};

module.exports = { mockRes, mockReq, mockNext, injectMock, clearMock, mockQuery };
