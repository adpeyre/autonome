npm run build

VERSION=$1

#LIN
node_modules/pkg/lib-es5/bin.js package.json --target node12-linux-x64 --no-bytecode --output "./bin/$VERSION-autonome-linux64"

#ARM
node_modules/pkg/lib-es5/bin.js package.json --targets=node12-linux-armv7 --no-bytecode --output "./bin/$VERSION-autonome-armv7"

echo "Packages created!";
