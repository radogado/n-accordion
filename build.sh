./node_modules/sass/sass.js n-accordion.scss n-accordion.css
./node_modules/sass/sass.js demo/demo.scss demo/demo.css
./node_modules/clean-css-cli/bin/cleancss -o n-accordion.min.css n-accordion.css
./node_modules/terser/bin/terser -o n-accordion.min.js --compress --mangle -- n-accordion.js
./node_modules/gzip-size-cli/cli.js --raw n-accordion.min.css > n-accordion.min.css.size
./node_modules/gzip-size-cli/cli.js --raw n-accordion.min.js > n-accordion.min.js.size
