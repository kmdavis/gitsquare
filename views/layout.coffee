doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title "#{@title} | Gitsquare" if @title?
  body ->
    div id: 'content', ->
      @body