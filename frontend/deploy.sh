#!/bin/bash

rm -rf build
npm ci
npm run build
aws s3 sync ./build s3://weather-forecast-frontend/ --delete --profile weather-app
RESPONSE_CLOUDFRONT=$(aws cloudfront create-invalidation --distribution-id EA0AFQU62UXQO --paths "/*" --profile weather-app)
echo $RESPONSE_CLOUDFRONT
