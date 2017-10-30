const generateAppUrl = function(applicationName, pageType) {
    return '/application/' + applicationName + '/' + pageType;
};

module.exports = (httpApp) => {

    httpApp.locals.generateAppUrl = generateAppUrl;

    const middleware = (req, res, next) => {
        res.locals.session = req.session;
        res.locals.path = req.path;
        next();
    };

    return {middleware};

};
