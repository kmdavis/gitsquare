var
  mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/*
mongoose.connect(process.env['DUOSTACK_DB_MONGODB']);

mongoose.model("Committer", new Schema({
  author: {
    name: { type: String, required: true },
    email: { type: String, index: true, required: true }
  },
  mayorships: [{
    url: { type: String, index: true, required: true },
    branch: { type: String, index: true, required: false }
  }]
}));

mongoose.model("Repository", new Schema({
  url: { type: String, index: true, required: true },
  rankings: [{
    author: {
      name: { type: String, required: true },
      email: { type: String, index: true, required: true }
    },
    numberOfCommits: { type: Number, required: true }
  }],
  branches: [{
    name: { type: String, required: true },
    rankings: [{
      author: {
        name: { type: String, required: true },
        email: { type: String, index: true, required: true }
      },
      numberOfCommits: { type: Number, required: true }
    }]
  }]
}));

mongoose.model("Commit", new Schema({
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
}));

module.exports = exports = {
  Committer: mongoose.model("Committer"),
  Repository: mongoose.model("Repository"),
  Commit: mongoose.model("Commit")
};*/
