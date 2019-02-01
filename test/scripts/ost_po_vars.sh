# Price Oracle variables
export OST_AUX_GETH_RPC_PROVIDER='http://127.0.0.1:8545'
export OST_AUX_GETH_WS_PROVIDER='ws://127.0.0.1:18545'
export OST_AUX_OWNER_ADDR='0xc363957f8cc55b38a2650666c15b15a7be766810'
export OST_AUX_OWNER_PASSPHRASE='testtest'
export OST_AUX_ADMIN_ADDR='0xa3d5945ew4c55b38a2761666cb1515a7be723423'
export OST_AUX_ADMIN_PASSPHRASE='testtest'
export OST_AUX_OPS_ADDR='0xebbbb2f7dbdf04936ac3ae4b4006e27c07857afb'
export OST_AUX_OPS_PASSPHRASE='testtest'

# Only for test scripts
export OST_AUX_SET_PRICE=0.5
export OST_AUX_CHAIN_ID=2001

# Cache related configurations
export OST_DEFAULT_TTL='60'
export OST_CACHING_ENGINE='redis'
export OST_REDIS_HOST='localhost'
export OST_REDIS_PORT='6380'
export OST_REDIS_PASS='my-secret'
export OST_REDIS_TLS_ENABLED='0'