
const rootPrefix = '../..'
  , OSTPriceOracle = require(rootPrefix+'/index')
  , priceOracle = OSTPriceOracle.priceOracle
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  ;

performer = async function(argv) {

  logger.info("Base Currency: "+argv[2]);
  logger.info("Quote Currency: "+argv[3]);
  logger.info("Input Decimal Price: "+argv[4]);
  logger.info("gas Price: "+argv[5]);
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

  const baseCurrency = argv[2]
    , quoteCurrency = argv[3]
    , decimalPrice =  parseFloat(argv[4])
    , gasPrice = argv[5]
    , fixedPointIntegerPrice = priceOracle.fixedPointIntegerPrice(decimalPrice).data.price
    ;

  logger.info("fixedPointInteger price: "+fixedPointIntegerPrice);
  // Set Fixed point integer in Wei unit
  await priceOracle.setPriceInSync(baseCurrency, quoteCurrency, fixedPointIntegerPrice, gasPrice);
  const contractDecimalPrice = (await priceOracle.decimalPrice(baseCurrency, quoteCurrency)).data.price; // Returns Decimal Price
  if (decimalPrice != contractDecimalPrice){
    logger.info("Something went wrong in setting price");
    logger.info("Input Price : "+decimalPrice);
    logger.info("Contract Price : "+contractDecimalPrice);
  } else {
    logger.info("Price Correctly Set!");
  }
  process.exit(0);
};

// node set_price.js OST USD 0.5 0x12A05F200
performer(process.argv);