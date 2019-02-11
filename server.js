const http = require('http');
const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const memoryFS = require('memory-fs');
const webpack = require("webpack");
const FileS = require("fs");
const path = require('path');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// app.get('/', function(req, res){
//   const returnRandomFiles = ( numFilesToLoad ) => {
//     const files = []

//     FileS.readdirSync('./js').forEach(function(file) {
//       if(file.match(/.*\.js$/)){
//         files.push('./js/' + file);
//       }
//     });

//     const filesToLoad = [];
//     for(let x = 0; x < numFilesToLoad; x++ ){
//       let randomNumber = Math.floor(Math.random() * ( files.length - x ) );
//       filesToLoad[x] = files[randomNumber];
//       let tempNumber = files[ files.length - (1 + x) ];
//       files[ files.length - (1 + x) ] = filesToLoad[x];
//       files[randomNumber] = tempNumber;
//     };

//     return filesToLoad;
//   };

  // let entryFiles = returnRandomFiles(150);

  let entryFiles = [ './js/368.js',
  './js/792.js',
  './js/column-subscribe.client.js',
  './js/101.js',
  './js/1210.js',
  './js/444.js',
  './js/197.js',
  './js/228.js',
  './js/10.js',
  './js/package-navigation.client.js',
  './js/curated-feed.model.js',
  './js/490.js',
  './js/585.js',
  './js/1037.js',
  './js/734.js',
  './js/362.js',
  './js/175.js',
  './js/677.js',
  './js/598.js',
  './js/vue-search-bar.client.js',
  './js/1254.js',
  './js/559.js',
  './js/775.js',
  './js/speed-bump.client.js',
  './js/1213.js',
  './js/517.js',
  './js/120.js',
  './js/671.js',
  './js/1085.js',
  './js/265.js',
  './js/224.js',
  './js/348.js',
  './js/212.js',
  './js/351.js',
  './js/104.js',
  './js/11.js',
  './js/1106.js',
  './js/955.js',
  './js/content-reveal.client.js',
  './js/460.js',
  './js/subscription-form-header.model.js',
  './js/497.js',
  './js/870.js',
  './js/425.js',
  './js/1274.js',
  './js/146.js',
  './js/768.js',
  './js/515.js',
  './js/607.js',
  './js/84.js' ];


app.get('/', function(req, res){
  const webpackCompiler = webpack({
    mode: 'production',
    entry: entryFiles,
    output: {
      filename: 'build.js',
      path: path.resolve('./')
    }
  });
  const fs = new memoryFS();
  webpackCompiler.outputFileSystem = fs;

  webpackCompiler.run((err, stats)=> {
    const outputPath = `${webpackCompiler.options.output.path}/${webpackCompiler.options.output.filename}`;

    fs.readFile(outputPath, (err, compiledCode)=> {
      res.render('index', {
        compiledCode
      });
    });
  });
});

const server = http.createServer(app);
server.listen(8000);
