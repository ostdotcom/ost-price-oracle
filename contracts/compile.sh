#!/bin/sh

BINDIRVALUE=./contracts/bin
ABIDIRUTILITY=./contracts/abi

mkdir -p "$BINDIRVALUE"
mkdir -p "$ABIDIRUTILITY"

echo ""
echo "Compiling PriceOracleInterface.sol"
echo ""

solc --abi --optimize --optimize-runs 200 --overwrite ../ost-price-oracle/contracts/PriceOracleInterface.sol -o $ABIDIRUTILITY
solc --bin --optimize --optimize-runs 200 --overwrite ../ost-price-oracle/contracts/PriceOracleInterface.sol -o $BINDIRVALUE

echo ""
echo "Compiling PriceOracle.sol"
echo ""

solc --abi --optimize --optimize-runs 200 --overwrite ../ost-price-oracle/contracts/PriceOracle.sol -o $ABIDIRUTILITY
solc --bin --optimize --optimize-runs 200 --overwrite ../openst-protocol/contracts/PriceOracle.sol -o $BINDIRVALUE