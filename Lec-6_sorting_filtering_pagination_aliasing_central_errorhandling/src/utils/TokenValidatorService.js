var TokenValidator = require('./TokenValidator');
var APIHandler = require('./APIHandler');

function TokenValidatorService()
{
	var secret = "menSekreA";

	var self = this;
	self.createValidator = function(req,res)
	{
		var tokenValidator = new TokenValidator(secret,req,res);
		return tokenValidator;
	}
	self.getTokenAuthenticatedUser = function(req,res,user)
	{
		
			var validator = self.createValidator(req,res);
		return validator.provideToken(user);					
	}
	
	self.validateToken= function (req,res,next)
	{	
		try
		{
			var tokenValidator = self.createValidator(req,res);
			tokenValidator.confirmIfTokenActuallyExists()
			.then(tokenValidator.validate)
			.then(function(payload)
			{
				try
				{	
					
					if(payload.isExpired)
					{
						var line = "---------------------------";
						console.log(line);
						console.log("expired session");
						console.log("user:");
						console.log(payload.user);
						console.log("time expired:");						
						console.log(new Date(payload.timeExpires));
						console.log(line);
							var handler = new APIHandler(req,res);
							var code = handler.signals.expiredSession;
							return handler.success({message:"expired"},code);
					}
					return 	next();
				
				}
				catch(ex)
				{
					console.log("error");
					var handler = new APIHandler(req,res);
					console.log(ex)
					handler.error(ex);
				
				}
			},function(err){
				console.log(err);
				var handler = new APIHandler(req,res);
				var code = handler.signals.noSession;
				return handler.success({message:"there is no session"},code);
			});	
		}
		catch(err)
		{
			console.log("error is pres");
			var handler = new APIHandler(req,res);
			handler.error(err)
		}
	}
		
}

module.exports = TokenValidatorService;