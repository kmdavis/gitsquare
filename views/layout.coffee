doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title "#{@title} | Gitsquare" if @title?
    link rel: 'stylesheet', href: '/css/layout.css'
  body ->
    div id: 'content', ->
      div id: 'logo', ->
        span "gs"
      @body