'use strict';
/**
 * Geth checker.
 *
 * @module test/scripts/gethChecker
 */

const web3 = require('web3');

const rootPrefix = '../../',
  testConstants = require(rootPrefix + '/test/scripts/constants'),
  logger = require(rootPrefix + '/lib/logger/customConsoleLogger'),
  wsEndpoint = testConstants.auxWsProvider,
  web3Provider = new web3(wsEndpoint);

/**
 * Class for geth checker.
 *
 * @class
 */
class GethChecker {
  /**
   * Constructor for geth checker.
   *
   * @constructor
   */
  constructor() {}

  /**
   * Main performer of class.
   */
  perform() {
    const delay = 10 * 1000,
      timeoutValue = 30 * 60 * 1000;

    let counter = 0,
      totalTime = counter * delay,
      isInProcess = false;

    setInterval(function() {
      if (totalTime <= timeoutValue) {
        if (isInProcess === false) {
          isInProcess = true;
          web3Provider.eth.getBlockNumber(function(err, blocknumber) {
            if (err || blocknumber < 1) {
              logger.log('Unable to get block number.');
            } else {
              logger.log('Block number: ', blocknumber);
              process.exit(0);
            }
            isInProcess = false;
          });
        }
      } else {
        logger.error('GethChecker unable to complete process in time: ', timeoutValue);
        process.exit(1);
      }
      counter++;
      totalTime = counter * delay;
    }, delay);
  }
}

new GethChecker().perform();
