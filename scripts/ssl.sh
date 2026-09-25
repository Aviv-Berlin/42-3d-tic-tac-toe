#!/bin/bash

ssl_key="app/secrets/ttt_nginx.key"
ssl_crt="app/secrets/ttt_nginx.crt"
if [[ ! -s $ssl_key  ||  ! -s $ssl_cert ]]; then
	$(openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $ssl_key -out  $ssl_crt )
fi
