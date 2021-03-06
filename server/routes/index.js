module.exports = app => {

    // Base URLS
    app.use('/api/chefs', require('./chefs.routes'))
    app.use('/api/user', require('./user.routes'))
    app.use('/api', require('./auth.routes'))

    app.use((req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    })

}