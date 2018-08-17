/*
 * Create and export configuration files
 *
*/

// Container for al lthe env.

var environments = {};

// Staging (Default) - and default environment when nothing specified
environments.staging = {
	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName' : 'staging',
	'hashingSecret': 'thisisasecret'
};

// Production environment
environments.production = {
	'httpPort' : 5000,
	'httpsPort' : 5001,
	'envName' : 'production',
	'hashingSecret': 'thisisalsoasecret'
};

// Determine which environmnet was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : {};

// Check that the current environment is one of the envs above, if not default to Staging
var environmnetToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the Module
module.exports = environmnetToExport;
