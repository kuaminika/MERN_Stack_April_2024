var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var TokenPayloadCreator = require('./TokenPayloadCreator');


function TokenValidator(newSecret,request,response)
{
	var self = this;
	var secret = newSecret;
	var tokenCreator = new TokenPayloadCreator();
	var req = request;
	var res = response;
	tokenCreator.request
		
	self.request = req;
	self.confirmIfTokenActuallyExists = function()
	{
		
		
		return new Promise(function(accept,reject)
		{
			try
			{
				
				var token = req.body.token || req.query.token || req.headers['x-access-token'];
				if(token)
				{	
						 accept(token);
				}
				else
				{
					reject();
				}
			}
			catch(e)
			{
				console.log("error")
				reject(e);
			}
			
		});
	}
	
	self.provideToken= function(user)
	{
		
		var payload = tokenCreator.createPayloadFromRequest(self.request);
		payload.user = user;

		var result = {};
		result.payload = payload;
		var stringPayload = JSON.stringify(payload);
		
		var token = jwt.sign(result,secret);
			

		return token
		
		
	}
	
	self.validate = function(token)
	{
		
		return new Promise(function(accept,reject)
		{
			 jwt.verify(token, secret, function(err, decoded) 
			{      console.log("toekn verified");
				  if (err) 
				  {
					  console.log(err);
					reject(err);
				  }
				  else 
				  {
					var payload = tokenCreator.createPayloadFromDecodedToken(decoded);
					
					accept(payload);
				  }
			});
		});		
	}
}

module.exports = TokenValidator;