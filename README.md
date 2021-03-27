# Autonome

Autonome is an app for keeping an eye on something.
 I developed this program in the intention of watching a secondary residence.
 
 
## Use case
Switch on a Raspberry Pi at defined times which launches Autonome to do different tasks like capturing photo, raise the temperature.
Then, these data are uploaded to a server and could be exposed on a website.

My system works with a solar panel, battery, 3G key and a Raspberry Pi.

## How does it work?

- Install node (>=12) on your system. 
- Download the autonome.js file: [releases](https://github.com/adpeyre/autonome/releases)
- Create your configuration file in json. You can find [examples](https://github.com/adpeyre/autonome/tree/master/example). 
- Execute autonome.js with the configuration file like this: `node ./autonome.js /path/to/config.json`


## Available features (modules)
Each module has its own directory. You can find its available configuration in it.

##### MOD_SHUTDOWN
A module to force to stop program after a specific time (in seconds).

##### MOD_1WIRE
A module to get data from 1Wire sensor (DS18B20 for temperature for example).

##### MOD_SNAPSHOT
A module to take pictures with cameras.

##### MOD_UPLOAD
A module to upload data to a server.

##### MOD_NOTIFY
A module to call specific url

##### MOD_INTERNET
A module to check if internet connection is established.

##### MOD_COMMAND
A module to execute specific commands.


