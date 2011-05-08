var
  http = require("http"),
  _ =require("underscore"),
  app = require("express").createServer(),
  db = require("./schema");

app.register(".coffee", require("coffeekup"));
app.set("view engine", "coffee");

app.get("/", function(req, res) {
  res.render("index", {});
});

app.get("/list_repos", function (req, res) {
  db.Repository.find({ url: /.*/ }, function (err, repos) {
    res.render("list_repos", { repos: repos });
  });
});

app.all("/github_receive", function (req, res) {
  var foo = JSON.parse(req.params.payload);

  db.Repository.findOne({ url: foo.repository.url }, function (err, repo) {
    if (!repo) {
      repo = new db.Repository({
        url: foo.Repository.url
      });
      repo.save();
    }
  });

  

  res.send("Congrats, you're now the mayor!");
  
  // todo
  /* example github post-receive:
  {
    "before": "5aef35982fb2d34e9d9d4502f6ede1072793222d",
    "repository": {
      "url": "http://github.com/defunkt/github",
      "name": "github",
      "description": "You're lookin' at it.",
      "watchers": 5,
      "forks": 2,
      "private": 1,
      "owner": {
        "email": "chris@ozmm.org",
        "name": "defunkt"
      }
    },
    "commits": [
      {
        "id": "41a212ee83ca127e3c8cf465891ab7216a705f59",
        "url": "http://github.com/defunkt/github/commit/41a212ee83ca127e3c8cf465891ab7216a705f59",
        "author": {
          "email": "chris@ozmm.org",
          "name": "Chris Wanstrath"
        },
        "message": "okay i give in",
        "timestamp": "2008-02-15T14:57:17-08:00",
        "added": ["filepath.rb"]
      },
      {
        "id": "de8251ff97ee194a289832576287d6f8ad74e3d0",
        "url": "http://github.com/defunkt/github/commit/de8251ff97ee194a289832576287d6f8ad74e3d0",
        "author": {
          "email": "chris@ozmm.org",
          "name": "Chris Wanstrath"
        },
        "message": "update pricing a tad",
        "timestamp": "2008-02-15T14:36:34-08:00"
      }
    ],
    "after": "de8251ff97ee194a289832576287d6f8ad74e3d0",
    "ref": "refs/heads/master"
  }
   */
});

app.listen(9876);