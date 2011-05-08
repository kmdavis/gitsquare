var
  http = require("http"),
  mongoose = require("mongoose");
  _ =require("underscore"),
  app = require("express").createServer();

app.register(".coffee", require("coffeekup"));
app.set("view engine", "coffee");

//mongoose.connect(process.env['DUOSTACK_DB_MONGODB']);

app.get("/", function(req, res, next) {
  res.render("index", {});
});

app.listen(9876);