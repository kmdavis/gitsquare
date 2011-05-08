h1 "Repos"
for repo, commits of @repos
  span "#{repo} with #{commits.length} commits:"
  ul ->
    for commit in commits
      li "#{commit.sha} by #{commit.author.name} on #{commit.timestamp}"