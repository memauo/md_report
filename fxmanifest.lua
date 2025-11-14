fx_version "cerulean"
game "gta5"

author "MD DEVELOPMENT"
description "Simple Report Menu Using Custom UI, for framework ESX"

client_script "client.lua"
server_script "server.lua"
ui_page "html/index.html"
files {
    "html/script.js",
    "html/style.css",
    "html/index.html",
}
shared_scripts {
  '@ox_lib/init.lua',
  'config.lua'
}