#!/bin/sh

DATADIR=$(pwd)/ost-po-chain
LOCAL_NETWORK_ID="--networkid 2001"

geth --datadir "$DATADIR" --port 30312 --rpcport 8545 --gasprice 0 --targetgaslimit 10000000 --etherbase '0x8fb010Abb03f03201d734Ffc64e3600405140D65' --ws --wsport 18545  --wsorigins "*" --rpc --maxpeers 0 --networkid 2001 --mine --minerthreads 4 --rpcapi net,eth,web3,personal,txpool --wsapi net,eth,web3,personal,txpool
