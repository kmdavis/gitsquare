var
  http = require("http"),
  _ = require("underscore"),
  express = require("express"),
  processor = require("./lib/processor"),

  app = express.createServer();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less']}));
  app.use(express.static(__dirname + '/public'));

  app.register(".coffee", require("coffeekup"));
  app.set("view engine", "coffee");
});

app.get("/", function(req, res) {
  res.render("comingsoon", {
    context: {
      title: "Coming Soon",
      showNav: false
    }
  });
});

app.get("/beta", function (req, res) {
  res.render("index", {
    context: {
      title: "Beta",
      showNav: true
    }
  });
});

app.get("/privacy", function (req, res) {
  res.render("privacy", {
    context: {
      title: "Privacy Policy",
      showNav: true
    }
  });
});

app.get("/terms", function (req, res) {
  res.render("terms", {
    context: {
      title: "Terms of Use",
      showNav: true
    }
  });
});

app.all("/github_receive", function (req, res) {
  res.send(200);

  processor.processPayload(JSON.parse(req.param("payload")));
});

app.listen(9876);

console.log("Gitsquare started");
