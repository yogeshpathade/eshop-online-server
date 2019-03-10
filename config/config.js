const fs = require('fs');
const path = require('path');

const defaultAppEnv = 'development';
const testAppEnv = 'test';

const appEnv = process.env.app_env || defaultAppEnv;

//  setting default application environment
if (process.env.app_env) {
    console.log(`Using app_env: ${process.env.app_env}`);
} else {
    console.log(`App parameter app_env is not set, setting it to default value: ${defaultAppEnv}`);
}

let configBuffer = null;

switch (appEnv) {
case testAppEnv:
    configBuffer = fs.readFileSync(path.resolve(__dirname, 'config.test.json'), 'utf-8');
    break;
case defaultAppEnv:
default:
    configBuffer = fs.readFileSync(path.resolve(__dirname, 'config.dev.json'), 'utf-8');
}

const config = JSON.parse(configBuffer);
module.exports = config;
