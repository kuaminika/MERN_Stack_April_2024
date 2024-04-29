function TokenPayLoad()
{
	this.timeCreated = new Date().getTime() ;
	this.timeExpires = this.timeCreated + (60*60*1000); 
	this.user = {};
	this.clientType =  "";
	this.clientIP =  "";
	this.requestHeaders = {};
}


module.exports = TokenPayLoad;