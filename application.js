const bodyParser = require('body-parser');
const config = require('node-env-config-loader');
const moduleExpress = require('module-express');
const moduleCore = require('module-core');
const moduleRedis = require('module-redis')(config.redis);
const logger = require('module-logger')({applicationName: 'teaching'});
const session = require('express-session');
const pugUtil = require('./util/pug');
const RedisStore = require('connect-redis')(session);

const httpApp = moduleExpress.getApplication();
const express = moduleExpress.getExpress();

const context = {
    config,
    logger,
    httpApp,
    redisClient: moduleRedis.getClient(),
    moduleCore
};

context.httpApp.locals.moment = require('moment');

context.httpApp.set('view engine', 'pug');
context.httpApp.use(bodyParser.json());
context.httpApp.use(bodyParser.urlencoded({extended: true}));
context.httpApp.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({client: context.redisClient, prefix: 'sess:teaching:'}),
}));
context.httpApp.use('/css', express.static('assets/css'));
context.httpApp.use('/js', express.static('assets/js'));
context.httpApp.use('/img', express.static('assets/img'));
context.httpApp.use(pugUtil(httpApp).middleware);

context.httpApp.locals.moduleCore = context.moduleCore;

module.exports = {
    init: function() {
        return Promise.resolve(context);
    },
    start: function() {
        require('./controller/basic')(context);

        context.httpApp.use(function(err, req, res, next) {
            context.logger.error(err.message, err);
            res.status(500).end();
        });

        return moduleExpress.start({port: config.port})
        .catch(logger.error);
    },
    stop: () => moduleExpress.stop()
};
