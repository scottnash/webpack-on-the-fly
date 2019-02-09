var http = require('http');
var express = require("express");
var app = express();
const exphbs = require('express-handlebars');
const memoryFS = require('memory-fs');
const webpack = require("webpack");

// Register Handlebars view engine
app.engine('handlebars', exphbs());
// Use Handlebars view engine
app.set('view engine', 'handlebars');


app.get('/', function(req, res){
  const returnRandomFiles = ( numFilesToLoad ) => {
    const files = [1,2,3,4,5];
    const filesToLoad = [];
    for(let x = 0; x < numFilesToLoad; x++ ){
      let randomNumber = Math.floor(Math.random() * ( files.length - x ) );
      filesToLoad[x] = files[randomNumber];
      let tempNumber = files[ files.length - (1 + x) ];
      files[ files.length - (1 + x) ] = filesToLoad[x];
      files[randomNumber] = tempNumber;
    };

    return filesToLoad;
  };


  let entryFiles = [];
  returnRandomFiles(3).forEach( index => {
    entryFiles.push( `./js/${index}.js`);
  });

  const webpackCompiler = webpack({
    entry: entryFiles
  });
  const fs = new memoryFS();
  webpackCompiler.outputFileSystem = fs;

  webpackCompiler.run((err, stats)=> {
    const compiledCode = webpackCompiler.outputFileSystem.data.Users.snash.workspace.test.dist['main.js'].toString();
    res.render('index', {
      compiledCode
    });
  });

});

var server = http.createServer(app);
server.listen(8000);
