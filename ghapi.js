const fetch = require("node-fetch");
/**
 * 
 * @param {string} path https://api.github.com/${path}
 */
async function apiRequest(path) {
    return fetch(`https://api.github.com/${path}`,
    {//https://dev.to/gr2m/github-api-authentication-personal-access-tokens-53kd
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`//temporarily using personal access token instead of registering an oauth app.
        }
    });
}

async function getFollowers(username, page=1) {
    const res = await apiRequest(`users/${username}/followers`).then(r => r.json())
    console.log(res)
    if(res.length==30) {
        console.log("YO")
        // const additionalRes = getFollowers(username, page+1);
        // res.push(...additionalRes);
    }
    return res;
}

async function getFollowing(username) {
    const res = await apiRequest(`users/${username}/following?page=${page}`).then(r => r.json())
    if(res.length==30) {
        const additionalRes = getFollowing(username, page+1);
        res.push(...additionalRes);
    }
    return res;
}

const connectionsCache = {};

async function getConnections(username) {
    if(connectionsCache[username]) {
        return connectionsCache[username];
    }
    const followers = await getFollowers(username);
    const following = await getFollowing(username);
    const res = {};
    for (const follow of [...followers, ...following]) {
        res[follow.login] = follow;
    }
    connectionsCache[username]=res;
    return res;
}

async function getInfo(username) {
    const res = await apiRequest(`users/${username}`);
    return {name: res.name, bio: res.bio};
}

getFollowers("ComBarnea").then(l=>console.log(l.length));

module.exports = {
    getConnections,
    async getNOrderConnections(username, n) {
        const yourConnections = await getConnections(username);
        let exploration = new Set(Object.keys(yourConnections));
        const visited = new Set([username]);
        const userInfo = JSON.parse(JSON.stringify(yourConnections));//janky deep copy
        for(const u in userInfo) {
            userInfo[u].mutualConnections=[];
        }
        while (n-- > 0) {
            const newExploration = new Set();
            for (const baseUser of exploration) {
                visited.add(baseUser);
                const newConnections = await getConnections(baseUser);
                for (const newUser in newConnections) {
                    if(newUser in yourConnections) {
                        userInfo[baseUser].mutualConnections.push(newConnections[newUser]);
                    }
                    if (!visited.has(newUser) && !exploration.has(newUser)) {
                        newExploration.add(newUser);
                        userInfo[newUser] = {...newConnections[newUser],mutualConnections:[]};
                    }
                }
            }
            exploration = newExploration;
        }
        visited.delete(username);
        return Array.from(visited.values()).reduce((accumulator, curUser)=> {
            accumulator[curUser] = userInfo[curUser];
            if(userInfo[curUser].mutualConnections.length==0) {
            }
            return accumulator;
        },{});
    }
}