const application = require('./application');

let context;

application.init()
    .then(ctx => {
        context = ctx;
        return application.start()
    })
    .then(() => {
        context.logger.info('application started !')
    })
    .catch(function(error){
        if (context) context.logger.error(error);
        console.log(error);
    })
