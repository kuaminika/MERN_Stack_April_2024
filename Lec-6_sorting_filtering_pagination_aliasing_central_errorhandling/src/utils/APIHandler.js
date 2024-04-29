var CustomSignalCodes = {
	noSession:{code:71,message:"need to login"},
	loginFailed:{code:55,message:"login failed"},
	expiredSession: {code:88,message:"session is expired"}
}


var APIHandler = function(request,response){
	var self = this;
	this.signals = CustomSignalCodes;
	this.success = function(result,code)
	{
		if(code)
		{
			result.code = code;
			
		}
		
		console.log("responding success to request");
		return  response.json(result);
	}
	this.error= function(err)
	{
		
		console.log("theres an error");
		console.log(err);
		return response.status(500).json({errprMessage:err});
	}
};

module.exports = APIHandler;