form action: "/github_receive", method: "POST", ->
  input type: "hidden", name: "payload", value: "{}"
  input type: "submit"