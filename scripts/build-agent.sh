#!/bin/bash

rm -rf ./dist/modules/Q_sessionrecorder
rm -rf ./dist/modules/D_sessionrecorderworker
rm -rf ./dist/modules/A_asyncCore
rm -rf ./dist/modules/c_core
rm -rf ./dist/modules/C_initCode
( yarn build --target=onearmy && yarn update-onearmy-server ) || ( echo "FAIL" && read )