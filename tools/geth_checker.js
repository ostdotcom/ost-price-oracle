'use strict';

const rootPrefix = '..'
    , logger = require(rootPrefix + '/helpers/custom_console_logger')
    , InstanceComposer = require(rootPrefix+ '/instance_composer')
;

require(rootPrefix + '/lib/web3/providers/ws');


const GethChecker = function(){

};

GethChecker.prototype.performer = async function () {
  const oThis = this
      , web3Provider = oThis.ic().getWeb3WSProvider()
  ;

  const delay = 10 * 1000
      , timeoutValue = 30 * 60 * 1000
  ;

  var counter = 0
    , totalTime = counter * delay
    , isInProcess = false
  ;

  setInterval(function () {
    if (totalTime <= timeoutValue) {
      if (isInProcess == false) {
        isInProcess = true;
        web3Provider.eth.getBlockNumber(function (err, blocknumber) {
          if (err || blocknumber < 1) {
            logger.debug("Unable to get blocknumber");
          } else {
            logger.debug("blocknumber", blocknumber);
            process.exit(0);
          }
          isInProcess = false;
        });
      }
    } else {
      logger.error("GethChecker unable to complete process in time: ", timeoutValue);
      process.exit(1);
    }
    counter++;
    totalTime = counter * delay;
  }, delay);
};

InstanceComposer.register( GethChecker, "getGethChecker", true );
const gethChecker = new GethChecker();
gethChecker.performer();
