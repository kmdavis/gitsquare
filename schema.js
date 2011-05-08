var
  mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  schema = {};

mongoose.connect(process.env['DUOSTACK_DB_MONGODB']);

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