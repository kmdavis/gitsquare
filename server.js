var
  http = require("http"),
  _ =require("underscore"),
  express = require("express"),
  app = express.createServer(),
  db = require("./schema");

app.use(express.bodyParser());

app.register(".coffee", require("coffeekup"));
app.set("view engine", "coffee");

app.get("/", function(req, res) {
  res.render("index", {});
});

app.get("/test", function (req, res) {
  res.render("test", { layout: true, context: { title: "foo" } });
});

app.get("/list_repos", function (req, res) {
  /*db.Repository.find({ url: /.*//* }, function (err, repos) {
    res.render("list_repos", { context: { repos: repos }});
  });*/
});

app.all("/github_receive", function (req, res) {
  var payload = JSON.parse(req.param("payload"));

  _.each(payload.commits, function (commit) {
    new db.Commit({
      repository: {
        url: payload.repository.url
      },
      author: {
        name: commit.author.name,
        email: commit.author.email
      },
      timestamp: new Date(commit.timestamp),
      branch: payload.ref.split("/")[2],
      added: commit.added,
      removed: commit.removed,
      modified: commit.modified,
      message: commit.message,
      sha: commit.id
    }).save();
  });

  /*db.Repository.findOne({ url: payload.repository.url }, function (err, repo) {
    if (!repo) {
      repo = new db.Repository({
        url: payload.repository.url
      });
    }

    _.each(payload.commits, function (commit) {
      var dbCommit = new db.Commit({
        timestamp: new Date(commit.timestamp)
      });

      dbCommit.save();
      repo.commits.push(dbCommit);

      *//*db.Committer.findOne({ email: commit.author.email }, function (err, committer) {
        if (!committer) {
          committer = new db.Committer({
            email: commit.author.email,
            name: commit.author.name
          });
        }

        committer.commits.push(dbCommit);
        committer.save();
      });*//*
    });

    repo.save();
  });*/

  res.render("receive_response", { layout: false });

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