var server_ip_port      = 12345;
var server_ip_address   = '0.0.0.0' //'25.104.135.94'

const hostName 					  = process.env.OPENSHIFT_NODEJS_IP ? 'davamil-davamil.rhcloud.com' : '127.0.0.1';
const ipAddress                   = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
const webServerPort               = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const webSocketPort 			  = process.env.OPENSHIFT_NODEJS_IP ? 8000 : 8080; 

module.exports = {
	'hostName' : hostName,
	'ipAddress' : ipAddress,
	'webSocketPort' : webSocketPort,
	'webServerPort' : webServerPort,

    'finder' : {
        'port' : webSocketPort,
        'host' : hostName
    }
};