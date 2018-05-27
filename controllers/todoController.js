var bodyParser = require('body-parser');
var mongoose = require('mongoose')

//connect to the database
mongoose.connect('mongodb://test:test@ds137740.mlab.com:37740/pulpcode_nodetest');

//create the schema
var todoSchema = new mongoose.Schema({
    item: String
});

//Todo model
var Todo = mongoose.model('Todo',todoSchema);
var itemOne = Todo({item: 'buy milk'}).save(function(err){
    if(err) throw err;
    console.log('item saved');
});

var data = [{item: 'get milk'}, {item:'feed baby'},{item: 'clean room'},{item:'wash car'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

app.get('/todo',function(req,res){
    //get data from mongo and pass it to view
    Todo.find({},function(err,data){
        if(err) throw err;
        res.render('todo',{todos:data});
    });
});

app.post('/todo',urlencodedParser,function(req,res){
    //get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err,data){
        if(err) throw err;
        res.json(data);
    });
});

app.delete('/todo/:item',function(req,res){
    //delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err,data){
        if(err) throw err;
        res.json(data);
    });
});
    
};