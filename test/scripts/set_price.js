
const rootPrefix          = '../..'
    , OSTPriceOracle      = require(rootPrefix+'/index')
    , logger              = require(rootPrefix + '/helpers/custom_console_logger')
;

let configStrategy = {};

performer = async function(argv) {

  logger.debug("Base Currency: "+argv[2]);
  logger.debug("Quote Currency: "+argv[3]);
  logger.debug("Input Decimal Price: "+argv[4]);
  logger.debug("gas Price: "+argv[5]);
  logger.debug("config file path: "+argv[6]);

  if (argv[2] === undefined || argv[2] == '') {
    logger.error("Invalid Base Currency");
    process.exit(0);
  }
  if (argv[3] === undefined || argv[3] == '') {
    logger.error("Invalid Quote Currency");
    process.exit(0);
  }
  if (argv[4] === undefined || argv[4] == '') {
    logger.error("Please input decimal price");
    process.exit(0);
  }
  if (argv[5] === undefined || argv[5] == '') {
    logger.error("Please input gas price");
    process.exit(0);
  }
  if (argv[6] === undefined || argv[6] == '') {
    logger.info("using default config file path");
    configStrategy = require( rootPrefix + "/tools/config_strategy.json" );
  } else {
    configStrategy = require( argv[6] )
  }

  let priceOracleObj      = new OSTPriceOracle( configStrategy )
    , priceOracle         = priceOracleObj.priceOracle
  ;

  const baseCurrency = argv[2]
    , quoteCurrency = argv[3]
    , decimalPrice =  parseFloat(argv[4])
    , gasPrice = argv[5]
    , fixedPointIntegerPrice = priceOracle.fixedPointIntegerPrice(decimalPrice).data.price
    , chainId = parseInt(configStrategy.OST_UTILITY_CHAIN_ID)
    ;

  logger.debug("fixedPointInteger price: "+fixedPointIntegerPrice);
  // Set Fixed point integer in Wei unit
  await priceOracle.setPriceInSync(chainId, baseCurrency, quoteCurrency, fixedPointIntegerPrice, gasPrice);
  const contractDecimalPrice = (await priceOracle.decimalPrice(chainId, baseCurrency, quoteCurrency)).data.price; // Returns Decimal Price
  if (decimalPrice != contractDecimalPrice){
    logger.debug("Something went wrong in setting price");
    logger.debug("Input Price : "+decimalPrice);
    logger.debug("Contract Price : "+contractDecimalPrice);
  } else {
    logger.debug("Price Correctly Set!");
  }
  process.exit(0);
};

// node set_price.js OST USD 0.5 0x12A05F200
performer(process.argv);