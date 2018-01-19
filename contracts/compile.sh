#!/bin/sh

ABIDIRUTILITY=./contracts/abi
BINDIRVALUE=./contracts/bin

mkdir -p "$ABIDIRUTILITY"
mkdir -p "$BINDIRVALUE"

echo ""
echo "Compiling PriceOracleInterface.sol"
echo ""

solc --abi --optimize --optimize-runs 200 --overwrite ../ost-price-oracle/contracts/PriceOracleInterface.sol -o $ABIDIRUTILITY
solc --bin --optimize --optimize-runs 200 --overwrite ../ost-price-oracle/contracts/PriceOracleInterface.sol -o $BINDIRVALUE

echo ""
echo "Compiling PriceOracle.sol"
echo ""

solc --abi --optimize --optimize-runs 200 --overwrite ../ost-price-oracle/contracts/PriceOracle.sol -o $ABIDIRUTILITY
solc --bin --optimize --optimize-runs 200 --overwrite ../ost-price-oracle/contracts/PriceOracle.sol -o $BINDIRVALUE