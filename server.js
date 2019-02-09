var http = require('http');
var express = require("express");
var app = express();

app.get('/', function(request, response){
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


  let entry = '';
  returnRandomFiles(3).forEach( index => {
    entry+= `"./js/${index}.js" `;
  });

  let command = 'npm run build -- ' + entry;

  const exec = require('child_process').exec;
  exec(command, ()=> {
    console.log(entry);
    response.sendfile('dist/index.html');
  });
});

var server = http.createServer(app);
server.listen(8000);
