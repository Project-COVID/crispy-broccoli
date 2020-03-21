const Response = require('../response');

module.exports = function(app) {
    app.use(`/api/v1/example`, require('./example')());

    // Catch unknown API endpoints as 404
    app.all(`/api/v1/*`, (req, res) => Response.NotFound().send(res));
};
