var
  mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;//,
  //schema = {};

mongoose.connect(process.env['DUOSTACK_DB_MONGODB']);

/* old schema:
schema.Commit = new Schema({
  timestamp: Date
});

schema.Repository = new Schema({
  url: String,
  commits: [schema.Commit]
});

schema.Committer = new Schema({
  name: String,
  email: String,
  commits: [schema.Commit]
});

mongoose.model("Repository", schema.Repository);
mongoose.model("Commit", schema.Commit);
mongoose.model("Committer", schema.Committer);

module.exports = exports = {
  Repository: mongoose.model("Repository"),
  Commit: mongoose.model("Commit"),
  Committer: mongoose.model("Committer")
};
*/

var Commit = new Schema({
  repository: {
    url: { type: String, index: true, required: true }
  },
  author: {
    name: { type: String, required: true },
    email: { type: String, index: true, required: true }
  },
  timestamp: { type: Date, required: true },
  branch: { type: String, required: true },
  message: { type: String, required: true },
  sha: { type: String, required: true, unique: true },
  added: { type: [String], required: false },
  removed: { type: [String], required: false },
  modified: { type: [String], required: false }
});

mongoose.model("Commit", Commit);

module.exports = exports = {
  Commit: mongoose.model("Commit")
};