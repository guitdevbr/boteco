"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Boteco = void 0;

var _express = require("express");

var _Context = _interopRequireDefault(require("./BotMaker/Context"));

var _Composer = _interopRequireDefault(require("./Composer"));

var _Context2 = _interopRequireDefault(require("./Context"));

var _Server = _interopRequireDefault(require("./Server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-shadow */
function always(x) {
  return () => x;
}

const noop = always(Promise.resolve());

class Boteco extends _Composer.default {
  /**
   * @param options pass context type for change webhook host, need token for connection;
   */
  constructor(options) {
    super();
    this.options = options;
    this.port = options.webhook?.port ?? process.env.PORT ?? '5555';
    this.webhook = options.webhook?.webhook ?? '/api/v1/webhook';
  }

  webhookHandler() {
    const router = (0, _express.Router)();
    router.post('/income', async (req, res) => {
      const {
        contextType
      } = this.options;
      const acceptedContextType = {
        botmaker: new _Context.default(this.options.TOKEN, req)
      };
      const ctx = new _Context2.default(acceptedContextType[contextType]);
      await Promise.resolve(this.middleware()(ctx, noop));
      return res.sendStatus(200);
    });
    return router;
  }
  /**
   * Starts polling hook
   */


  launch(router) {
    this.server = new _Server.default({
      port: this.port,
      webhook: this.webhook
    });
    this.server.app.express.use(this.webhook, this.webhookHandler());

    if (router) {
      this.server.app.express.use(router);
    }
  }

}

exports.Boteco = Boteco;
var _default = Boteco;
exports.default = _default;