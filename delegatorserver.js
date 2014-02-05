var http = require("http");
var url = require("url");
var connect = require("connect");

var name="Delegator static server";
var version ="0.1";
var port =8080;

function start(){

connect()
    .use(connect.static('static'))
    .listen(port);
console.log("Running " + name + " " +version + " on port:" +port);
/*
function start(route){
	function onRequest(request ,response){
	var pathname = url.parse(request.url).pathname;
	
	route(pathname);
	
	response.writeHead(200,{"Content-Type":"text/plain"});
	response.write("hallow world " + pathname);
	response.end();
	}

	http.createServer(onRequest).listen(port);
	console.log("Running " + name + " " +version + " on port:" +port);
}*/
}
exports.start= start;