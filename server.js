const express = require('express'),
    app = express(),
    path = require('path'),
    jsonFile = require('./tree-structure.json');


app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=>{
    res.redirect('/structure-visualization-tree')
});

app.get('/structure-visualization-tree',(req,res)=>{
    res.sendFile('index.html',{root:path.join(__dirname,'public')})
});


app.get('/structure-source',(req,res)=>{
   res.json(jsonFile);
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});