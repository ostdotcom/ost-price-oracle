#!/bin/sh

DATADIR=$(pwd)/ost-po-chain
LOCAL_NETWORK_ID="--networkid 20171011"

geth --datadir "$DATADIR" --rpcport 8545 --gasprice 0 --targetgaslimit 10000000 --etherbase 0 --unlock 0 --password pw --ws --wsport 18545  --wsorigins "*" --rpc --maxpeers 0 $LOCAL_NETWORK_ID --mine --minerthreads 4 --rpcapi net,eth,web3,personal --wsapi net,eth,web3,personal
