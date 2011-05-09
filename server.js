var
  http = require("http"),
  _ = require("underscore"),
  express = require("express"),

  app = express.createServer(),
  worker_thread = new (require("webworker")).Worker(process.cwd() + "/worker_thread.js");

worker_thread.onmessage = function (msg) {
  console.log(msg);
  if ("log" === msg.type) {
    console.log.apply(null, msg.args);
  }
};

process.on("exit", function () {
  worker_thread.terminate();
});

app.use(express.bodyParser());

app.register(".coffee", require("coffeekup"));
app.set("view engine", "coffee");

app.get("/", function(req, res) {
  res.render("index", {});
});

app.all("/github_receive", function (req, res) {
  res.send(200);

  // Worker thread does the hard work of storing in the db, calculating mayors and badges.
  // I can't find a way to send a message back to the committer via github's post-receive
  //   so there's no good reason to do this synchronously.
  worker_thread.postMessage({
    type: "payload",
    payload: JSON.parse(req.param("payload"))
  });
});

app.listen(9876);

console.log("Web Thread started");
