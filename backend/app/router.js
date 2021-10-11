'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/mointor/reportError', controller.mointor.reportError);
  router.get('/mointor/emptyFolder', controller.mointor.emptyFolder);
  router.post('/mointor/uploadSourceMap', controller.mointor.uploadSourceMap);
};
