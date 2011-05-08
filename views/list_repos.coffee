h1 "Repos"
for repo in @repos
  span "#{repo.url} with #{repo.commits.length} commits"