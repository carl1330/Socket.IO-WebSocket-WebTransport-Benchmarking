#!/bin/bash
HASH=`openssl x509 -pubkey -noout -in cert.pem |
    openssl pkey -pubin -outform der |
    openssl dgst -sha256 -binary |
    base64`

flatpak run com.github.Eloston.UngoogledChromium\
    --ignore-certificate-errors-spki-list=$HASH \
    --origin-to-force-quic-on=127.0.0.1:1337 \
    https://localhost:8080