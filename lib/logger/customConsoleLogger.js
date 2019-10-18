const OSTBase = require('@ostdotcom/base'),
  Logger = OSTBase.Logger;

const rootPrefix = '../..',
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  loggerLevel = Number(coreConstants.DEBUG_ENABLED) === 1 ? Logger.LOG_LEVELS.TRACE : Logger.LOG_LEVELS.DEBUG;

module.exports = new Logger('saas-api', loggerLevel);
