#!/bin/sh

DATADIR=./ost-po-chain

mkdir -p "$DATADIR"

rm -rf "$DATADIR/geth"

geth --datadir "$DATADIR" init ost_po_genesis.json

