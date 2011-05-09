var
  http = require("http"),
  _ = require("underscore"),
  express = require("express"),
  processor = require("./lib/processor"),

  app = express.createServer();

app.use(express.bodyParser());

app.register(".coffee", require("coffeekup"));
app.set("view engine", "coffee");

app.get("/", function(req, res) {
  res.render("index", {});
});

app.all("/github_receive", function (req, res) {
  res.send(200);

  processor.processPayload(JSON.parse(req.param("payload")));
});

app.listen(9876);

console.log("Gitsquare started");
