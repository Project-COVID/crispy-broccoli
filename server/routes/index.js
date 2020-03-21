const Response = require('../response');

module.exports = function(app) {
    app.use(`/v1/example`, require('./example')());

    // Catch unknown API endpoints as 404
    app.all(`/v1/*`, (req, res) => Response.NotFound().send(res));
};
