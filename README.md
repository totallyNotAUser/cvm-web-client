# CollabVM++
An alternative client for CollabVM
[Open it](http://totallyNotAUser.github.io/cvm-web-client)

## Name
It is not written in c++, but i decided to name it CollabVM++ because it extends the normal CollabVM experience.

## HTTPS Warning
If you open CollabVM++ through the "Open it" link at the start of this README, most VMs won't work. That is because it is hosted on Github Pages, and Github Pages requires HTTPS (secure connection), but due to browser security, you can't connect to a `ws://` (insecure websocket) from HTTPS. 

One way to solve this is to clone/download this repo and open index.html locally. Keep in mind, this client uses `localStorage` to store your settings, and behavior of that inside `file://` (locally opened file) may vary across different browsers (it works ok in firefox).

At the time of writing, the only VM that supports `wss://` (secure websocket) is the Debian arm64 VM (the one that does not have internet).

## Official CollabVM VMs
They do not work for some reason, the server just does not send data (the client sends the same thing as the offical client). If anyone knows how to fix this, please create an issue.
