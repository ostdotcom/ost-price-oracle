#!/bin/bash
curl https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.8.22-7fa3509e.tar.gz | tar xvz
mv geth-linux-amd64-1.8.22-7fa3509e /usr/local/bin
ln -s /usr/local/bin/geth-linux-amd64-1.8.22-7fa3509e/geth /usr/local/bin/geth
export PATH="$PATH:/usr/local/bin/geth-linux-amd64-1.8.22-7fa3509e"
