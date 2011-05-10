doctype 5
html ->
  head ->
    meta charset: "utf-8"
    title "#{@title} | Gitsquare" if @title?
    link rel: "stylesheet", href: "/css/layout.css"
  body ->
    div id: "container", ->
      a href: "/", id: "logo", ->
        span "gs"
      if @showNav
        div id: "nav", ->
          a href: "#", "item 1"
          a href: "#", "item 2"
          a href: "#", "item 3"
          a href: "#", "item 4"
      @body
    div id: "footer", ->
      text "Copyright &copy; 2011 Gitsquare | "
      a href: "/privacy", "Privacy Policy"
      text " | "
      a href: "/terms", "Terms of Use"