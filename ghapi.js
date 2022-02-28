import fetch from 'node-fetch';

export async function getFollowers(username) {
    const followers = await fetch(`https://api.github.com/users/${username}/followers`,
        {//https://dev.to/gr2m/github-api-authentication-personal-access-tokens-53kd
            headers: {
                authorization: `username:token ${process.env.GITHUB_TOKEN}`//temporarily using personal access token instead of registering an oauth app.
            }
        }).then(r => r.json())
    return followers;
}

export async function getFollowing(username) {
  const following = await fetch(`https://api.github.com/users/${username}/following`,
  {//https://dev.to/gr2m/github-api-authentication-personal-access-tokens-53kd
    headers: {
      authorization: `username:token ${process.env.GITHUB_TOKEN}`//temporarily using personal access token instead of registering an oauth app.
    }
  }).then(r=>r.json())
  return following;
}

export async function getConnections(username) {
    const followers = await getFollowers(username)
    const following = await getFollowing(username);
    const res = {};
    for(const follow of [...followers, ...following]) {
        res[follow.login] = follow;
    }
    return res;
}