#npm run build

VERSION=$1

#LIN
#node_modules/.bin/pkg package.json --targets node12.13.1-linux-x64 --output "./bin/$VERSION-autonome-linux64"

#ARM
node_modules/.bin/pkg -d --targets=node12.2.0-linux-armv7  --output  "./bin/$VERSION-autonome-armv7" ./build/app.js

echo "Packages created!";
