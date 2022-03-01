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

function makePaginatedRequester(endpoint) {
    const perPage = 100;
    return async function paginatedRequest(username, page=1) {
        //slow pagination because we have to wait for one request to finish to know if we need to fetch the next page 😢
        const res = await apiRequest(`users/${username}/${endpoint}?page=${page}&per_page=${perPage}`).then(r => r.json())
        try {
            if(res.length==perPage) {
                const additionalRes = await paginatedRequest(username, page+1);
                res.push(...additionalRes);
            }
        } catch(e) {
            console.trace(e);
        } finally {
            return res;
        }
    }
}

const getFollowers = makePaginatedRequester("followers");
const getFollowing = makePaginatedRequester("following");

const connectionsCache = {};

async function getConnections(username) {
    if(connectionsCache[username]) {
        return connectionsCache[username];
    }
    try {
        const followers = await getFollowers(username);
        const following = await getFollowing(username);
        const res = {};
        for (const follow of [...followers, ...following]) {
            res[follow.login] = follow;
        }
        connectionsCache[username]=res;
        return res;
    } catch(e) {
        console.trace(e);
    }
}

async function getInfo(username) {
    const res = await apiRequest(`users/${username}`);
    return {name: res.name, bio: res.bio};
}


module.exports = {
    getFollowers,
    getConnections,
    async getNOrderConnections(username, n) {
        const initialN = n;
        const yourConnections = await getConnections(username);
        let exploration = new Set(Object.keys(yourConnections));
        const visited = new Set([username]);
        const userInfo = JSON.parse(JSON.stringify(yourConnections));//janky deep copy
        for(const u in userInfo) {
            userInfo[u].mutualConnections=[];
        }
        while (n-- > 0) {
            const newExploration = new Set();
            await Promise.all(Array.from(exploration.values()).map(async (baseUser)=> {
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
                return baseUser;
            }));
            exploration = newExploration;
        }
        visited.delete(username);
        if(initialN!=1) {
            for(const connection in yourConnections) {
                visited.delete(connection);
            }
        }
        return Array.from(visited.values()).reduce((accumulator, curUser)=> {
            accumulator[curUser] = userInfo[curUser];
            if(userInfo[curUser].mutualConnections.length==0) {
            }
            return accumulator;
        },{});
    }
}