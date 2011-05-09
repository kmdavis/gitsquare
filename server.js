var
  http = require("http"),
  _ =require("underscore"),
  express = require("express"),
  app = express.createServer(),
  db = require("./schema");

var
  MAYORSHIP_MOVING_WINDOW = 7 * 24 * 60 * 60 * 1000; // 1 week

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
  db.Commit.find({}, function (err, commits) {
    var commitsByRepository = {};

    _.each(commits, function (commit) {
      if (!commitsByRepository[commit.repository.url]) {
        commitsByRepository[commit.repository.url] = [];
      }

      commitsByRepository[commit.repository.url].push(commit);
    });

    res.render("list_repos", { context: { repos: commitsByRepository }});
  });
});

// Rules:
// 1) Limit commits to a moving window (1 week)
// 2) If a repo is provided, limit by that repo
// 3) If a branch is provided, limit by that branch
// 4) Group commits by author (email)
// 5) Order authors by number of commits
// 6) If there is a tie, order in reverse order of the most recent commit
var calculateMayorOf = function (callback, repo, branch) {
  var query = {
    timestamp: {
      $gte: (new Date(new Date().getTime() - MAYORSHIP_MOVING_WINDOW))
    }
  };

  if (repo) {
    query["repository.url"] = repo;
    if (branch) {
      query.branch = branch;
    }
  }

  db.Commit.find(query, function (err, commits) {
    console.log(commits);

    var commitsByAuthor = {}, authors = [];

    // Might not be necessary, but I suspect it is
    commits = _.sortBy(commits, function (commit) {
      return commit.timestamp;
    });

    _.each(commits, function (commit) {
      if (!commitsByAuthor[commit.author.email]) {
        commitsByAuthor[commit.author.email] = [];
      }

      commitsByAuthor[commit.author.email].push(commit);
    });

    _.each(commitsByAuthor, function (commits, author) {
      authors.push({
        email: author,
        commits: commits
      });
    });

    commitsByAuthor = _.sortBy(authors, function (author) {
      var sortKey = author.commits.length + "_" + author.commits[0].timestamp.getTime() + "_" + author.email;

      // TODO: There must be a better way
      if (author.commits.length < 10) {
        sortKey = "0000" + sortKey;
      } else if (author.commits.length < 100) {
        sortKey = "000" + sortKey;
      } else if (author.commits.length < 1000) {
        sortKey = "00" + sortKey;
      } else if (author.commits.length < 10000) {
        sortKey = "0" + sortKey;
      }
      
      return sortKey;
    });

    callback(authors);
  });
};

app.get("/mayor_of/:url", function (req, res) {
  calculateMayorOf(function (author) {
    res.send(author[0].email + " is the mayor with " + author[0].commits.length + " commits");
  }, req.param("url"));
});

app.get("/mayor_of/:url/:branch", function (req, res) {
  calculateMayorOf(function (author) {
    res.send(author[0].email + " is the mayor with " + author[0].commits.length + " commits");
  }, req.param("url"), req.param("branch"));
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