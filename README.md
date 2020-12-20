# Autonome

Autonome is an app for keeping an eye on a place.
 I developed this program in the intention of watching a country house.
 
 
## Use case
Switch on a Raspberry Pi at defined times which launches Autonome to do different tasks like capturing photo, raise the temperature.
Then, these data are uploaded to a server and could be made on a website.

My system works with a solar panel, battery, 3G key and a Raspberry Pi.


## How does it work?

Get right binary corresponding to your system.
Then, execute it with a configuration file like this: `./autonome /path/to/config.json`


## Available modules
Each module is written in a specific file in `src/mods/<module>.ts`.
Its available configuration is defined in its module file with an interface: 
```typescript
interface ModModuleConfig {

}
```

##### MOD_SHUTDOWN
A module to force to stop program after a specific time (in seconds).

##### MOD_TEMPERATURE
A module to get temperature with a sensor DS18B20.

##### MOD_SNAPSHOT
A module to take picture with cameras.

##### MOD_UPLOAD
A module to upload data to a server.

##### MOD_NOTIFY
A module to call specific url

##### MOD_INTERNET
A module to connect to internet with a 3G key. You have to provide a wvdial file configuration.

##### MOD_COMMAND
A module to execute specific commands.

## Get executable
You can download executable [here](https://projet.peyre.fr/autonome/).


