const fetch = require("node-fetch");

async function getFollowers(username) {
    const followers = await fetch(`https://api.github.com/users/${username}/followers`,
        {//https://dev.to/gr2m/github-api-authentication-personal-access-tokens-53kd
            headers: {
                authorization: `token ${process.env.GITHUB_TOKEN}`//temporarily using personal access token instead of registering an oauth app.
            }
        }).then(r => r.json())
    return followers;
}

async function getFollowing(username) {
    const following = await fetch(`https://api.github.com/users/${username}/following`,
        {//https://dev.to/gr2m/github-api-authentication-personal-access-tokens-53kd
            headers: {
                authorization: `token ${process.env.GITHUB_TOKEN}`//temporarily using personal access token instead of registering an oauth app.
            }
        })
    if (following.ok)
        return following.json();
    else {
        console.log(following);
        throw "see console output"
    }
}

async function getConnections(username) {
    try {
        const followers = await getFollowers(username);
        const following = await getFollowing(username);
        const res = {};
        for (const follow of [...followers, ...following]) {
            res[follow.login] = follow;
        }
        return res;
    } catch (e) {
        console.error(`error on ${username}, ${e}`)
    }
}

module.exports = {
    getConnections,
    async getNOrderConnections(username, n) {
        let exploration = new Set([username]);
        const visited = new Set();
        const userInfo = {};
        while (n-- > 0) {
            const newExploration = new Set();
            for (const baseUser of exploration) {
                visited.add(baseUser);
                const newConnections = await getConnections(baseUser);
                for (const newUser in newConnections) {
                    if (!visited.has(newUser) && !exploration.has(newUser)) {
                        newExploration.add(newUser);
                        userInfo[newUser] = newConnections[newUser];
                    }
                }
            }
            exploration = newExploration;
        }
        for(const user of exploration) {
            visited.add(user);
        }
        visited.delete(username);
        console.log(visited);
        return Array.from(visited.values()).reduce((accumulator, curUser)=> {
            accumulator[curUser] = userInfo[curUser];
            return accumulator;
        },{});
    }
}