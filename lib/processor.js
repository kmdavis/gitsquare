var
  _ = require("underscore"),
  deferred = require("./deferred"),
  db = require("./schema");

var
  MAYORSHIP_MOVING_WINDOW = 7 * 24 * 60 * 60 * 1000; // 1 week

var
  // Rules:
  // 1) Limit commits to a moving window (1 week)
  // 2) If a repo is provided, limit by that repo
  // 3) If a branch is provided, limit by that branch
  // 4) Group commits by author (email)
  // 5) Order authors by number of commits
  // 6) If there is a tie, order in reverse order of the most recent commit
  calculateMayorOf = function (repo, branch) {
    var
      dfd = deferred.Deferred();
      query = {
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
      //console.log(commits);

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

      // todo: store in db

      dfd.resolve();
    });

    return dfd;
  },

  reposToProcess = [],
  usersToProcess = [],

  processing = false,

  processCommitsWorker = _.throttle(function () {
    processing = true;
    reposToProcess = _.uniq(reposToProcess);

    deferred.when(deferred.Deferred(function (dfd) {

      deferred.when.apply(null, _.map(reposToProcess, function (repo) {
        return calculateMayorOf(repo);
      })).done(function () {
        dfd.resolve();
      });
      
    }, deferred.Deferred(function (dfd) {

      /*deferred.when.apply(null, _.map(usersToProcess, function (repo) {

      })).done(function () {
        dfd.resolve();
      });*/

      dfd.resolve();

    }))).done(function () {
      processing = false;
    });
  }, 250),

  processCommit = function (repository, commit) {
    reposToProcess.push(repository.url);
    usersToProcess.push(commit.author.email);

    if (!processing) {
      processCommitsWorker();
    }
  },

  processPayload = function (payload) {
    //console.log(payload);

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
      }).save(function () {
        processCommit(payload.repository, commit);
      });
    });
  };

exports.processPayload = processPayload;