module.exports = context => {

    context.httpApp.get('/', function(req, res, next) {
        res.render('home');
    });

    context.httpApp.get('/about', function(req, res, next) {
        res.render('about');
    });

}
