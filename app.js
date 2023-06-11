//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = required("mongoose")


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item= mongoose.model("item",itemsSchema);

const item1= new Item({
  name: "welcome to the todolist"
});
const item2= new Item({
  name: "Hit the + button to add a new item"
});
const item3= new Item({
  name: "Hit the - button to delete an item"
});

const defaultItems = [item1,item2,item3];
Item.insertMany(defaultItems, function(err){
  
});

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List= mongoose.model("list", listSchema);


const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/:customListName", function(req,res){
  const customeListName= _.capital(req.params.customListName);

  List.findOne({name: customListName, function(err, foundList){
    if(!err){
      if(!foundList){
        const list= newList({
          name: customListName,
          items: defaultItems
        })
        list.save();
        res.redirect("/"+ customListName);

      } else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList.Items})
      }
    }
  }
  });

  
});

app.get("/", function(req, res) {

  Item.finder({}, function(err, foundItems){
    if(foundItems.length === 0){
      if (err){
        console.log(err);
      }else{
        console.log("successfully saved default items to DB.");
        res.redirect("/");
      }
    }
    res.direct("/");
  } else {
    res.render("list", {listTitle: "Today", newListItems: items});
  });
   
});

  

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;
  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
  res.redirect("/");
  } else {
    ListfindOne({name: listName},function(err, foundlist){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+ listName);
    });
  }

  
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox);
Iten.findByIdAndRemove(checkedItemId, function(err){
  if(!err){
    console.log("successfully deleted saved item");
    res.redirect("/");
} else{
  List.findOneAndUpdate({name: listName}, {$pull: {items: {__id: checkedItemId}}}, function(err, foundList){
    if (!err){
      res.redirect("/"+ listName);
    }
  }
}
});



app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
