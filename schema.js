var
  mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  schema = {};

mongoose.connect(process.env['DUOSTACK_DB_MONGODB']);

schema.Repository = new Schema({
  url: String
});

schema.Committer = new Schema({
  name: String,
  email: String,
  // todo
  badges: [ObjectId],
  mayorships: [ObjectId]
});

schema.Commit = new Schema({
  author: ObjectId,
  timestamp: Date
});

mongoose.model("Repository", schema.Repository);
mongoose.model("Commit", schema.Commit);
mongoose.model("Committer", schema.Committer);

module.exports = exports = {
  Repository: mongoose.model("Repository"),
  Commit: mongoose.model("Commit"),
  Committer: mongoose.model("Committer")
};