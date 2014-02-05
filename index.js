var delegatorserver = require("./delegatorserver");
var router = require("./router");

delegatorserver.start(router.route);