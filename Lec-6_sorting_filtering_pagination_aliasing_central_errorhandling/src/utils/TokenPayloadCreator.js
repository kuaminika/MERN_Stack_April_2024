var TokenPayLoad = require('./TokenPayLoad');

var TokenPayloadCreator = function()
{
	var self = this;
	self.request;
	self.createPayloadFromRequest = function(request)
	{	
		self.request = request;
	
		var payload = new TokenPayLoad()
		payload.timeCreated = new Date().getTime() ;
		payload.timeExpires = payload.timeCreated + (60*60*1000); 
		payload.user = self.request.body? self.request.body.user : {};
		payload.clientType = self.request.headers["user-agent"];
		payload.clientIP = self.request.headers.origin;
		payload.requestHeaders= self.request.headers;
		return payload;
	}
	
	
	self.createPayloadFromDecodedToken = function(decoded)
	{
		decoded = decoded.payload;
		console.log(decoded);
		var payload = new TokenPayLoad()
		payload.timeCreated = decoded.timeCreated ;
		payload.timeExpires = decoded.timeExpires; 
		payload.user = decoded.user;
		payload.clientType = decoded.clientType;
		payload.clientIP = decoded.clientIP;
		payload.requestHeaders= decoded.requestHeaders;
		payload.timeLeft = function()
		{
			var now = new Date().getTime();
			
			return payload.timeExpires-now;
			
		}();
		payload.isExpired = function()
		{
			return payload.timeLeft<0;
		}()
		return payload;
	}
}


module.exports = TokenPayloadCreator;