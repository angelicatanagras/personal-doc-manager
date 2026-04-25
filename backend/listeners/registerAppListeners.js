const appEventBus = require('../events/appEventBus');

let listenersRegistered = false;

const registerAppListeners = () => {
  if (listenersRegistered) return;

  appEventBus.on('document:uploaded', ({ document, userId }) => {
    if (process.env.NODE_ENV !== 'test') {
      console.info(`[event] document:uploaded user=${userId} document=${document._id}`);
    }
  });

  appEventBus.on('document:deleted', ({ documentId, userId, action }) => {
    if (process.env.NODE_ENV !== 'test') {
      console.info(`[event] document:${action} user=${userId} document=${documentId}`);
    }
  });

  appEventBus.on('user:statusChanged', ({ userId, status }) => {
    if (process.env.NODE_ENV !== 'test') {
      console.info(`[event] user:statusChanged user=${userId} status=${status}`);
    }
  });

  listenersRegistered = true;
};

module.exports = registerAppListeners;
