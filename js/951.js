window.modules["951"] = [function(require,module,exports){module.exports={
  "_from": "csso@~3.0.0",
  "_id": "csso@3.0.1",
  "_inBundle": false,
  "_integrity": "sha1-FGmvXuLsUJrdrdh3eqDkWstrL1g=",
  "_location": "/postcss-csso/csso",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "csso@~3.0.0",
    "name": "csso",
    "escapedName": "csso",
    "rawSpec": "~3.0.0",
    "saveSpec": null,
    "fetchSpec": "~3.0.0"
  },
  "_requiredBy": [
    "/postcss-csso"
  ],
  "_resolved": "https://registry.npmjs.org/csso/-/csso-3.0.1.tgz",
  "_shasum": "1469af5ee2ec509addadd8777aa0e45acb6b2f58",
  "_spec": "csso@~3.0.0",
  "_where": "/Users/snash/workspace/sites/node_modules/postcss-csso",
  "author": {
    "name": "Sergey Kryzhanovsky",
    "email": "skryzhanovsky@ya.ru",
    "url": "https://github.com/afelix"
  },
  "bugs": {
    "url": "https://github.com/css/csso/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "css-tree": "1.0.0-alpha17"
  },
  "deprecated": false,
  "description": "CSSO (CSS Optimizer) is a CSS minifier with structural optimisations",
  "devDependencies": {
    "browserify": "^13.0.0",
    "coveralls": "^2.11.6",
    "eslint": "^2.2.0",
    "istanbul": "^0.4.2",
    "jscs": "~2.10.0",
    "mocha": "~2.4.2",
    "source-map": "^0.5.6",
    "uglify-js": "^2.6.1"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "eslintConfig": {
    "env": {
      "node": true,
      "mocha": true,
      "es6": true
    },
    "rules": {
      "no-duplicate-case": 2,
      "no-undef": 2,
      "no-unused-vars": [
        2,
        {
          "vars": "all",
          "args": "after-used"
        }
      ]
    }
  },
  "files": [
    "bin",
    "dist/csso-browser.js",
    "lib",
    "HISTORY.md",
    "LICENSE",
    "README.md"
  ],
  "homepage": "https://github.com/css/csso",
  "keywords": [
    "css",
    "minifier",
    "minify",
    "compress",
    "optimisation"
  ],
  "license": "MIT",
  "main": "./lib/index",
  "maintainers": [
    {
      "name": "Roman Dvornov",
      "email": "rdvornov@gmail.com"
    }
  ],
  "name": "csso",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/css/csso.git"
  },
  "scripts": {
    "browserify": "browserify --standalone csso lib/index.js | uglifyjs --compress --mangle -o dist/csso-browser.js",
    "codestyle": "jscs lib test && eslint lib test",
    "codestyle-and-test": "npm run codestyle && npm test",
    "coverage": "istanbul cover _mocha -- -R dot",
    "coveralls": "istanbul cover _mocha --report lcovonly -- -R dot && cat ./coverage/lcov.info | coveralls",
    "gh-pages": "git clone -b gh-pages https://github.com/css/csso.git .gh-pages && npm run browserify && cp dist/csso-browser.js .gh-pages/ && cd .gh-pages && git commit -am \"update\" && git push && cd .. && rm -rf .gh-pages",
    "hydrogen": "node --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm --trace_hydrogen_file=code.cfg --print-opt-code bin/csso --stat -o /dev/null",
    "prepublish": "npm run browserify",
    "test": "mocha --reporter dot",
    "travis": "npm run codestyle-and-test && npm run coveralls"
  },
  "version": "3.0.1"
}
}, {}];
