# Supplyframe Full Stack Intern Challenge

Uses the github api to find recommended people to follow on github, similar to how Facebook or LinkedIn find people you might know based on mutual friends or connections. It will also show you the mutual followers/following you have with those recommended people.

To run it locally, clone it then run `npm i` then `npm start` in the project root directory.

To view the live demo, visit [fluffy-glorious-armchair.glitch.me](https://fluffy-glorious-armchair.glitch.me/)

Usually getting all the data takes a while; it takes about 1-2 minutes using my handle, `EricPedley`, with a degree of separation of 2. Speed was one of the biggest hurdles in making this project. I managed to get some speedup by making requests concurrently with Promise.all.
