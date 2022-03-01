const {getFollowing, getConnections} = require("./ghapi");
require("dotenv").config();
let following;
test('get following of EricPedley', ()=> {
    getFollowing("EricPedley",1,2).then(res=> {
        following = res.map(e=>e.login);
        expect(following).toContain("ivynguyen2303");
        expect(following.length).toBeGreaterThan(5);
    })
})

test('get connections of EricPedley', ()=> {
    getConnections("EricPedley").then(res=> {
        const keys = Object.keys(res);
        expect(keys).toContain("ivynguyen2303");
        for(const k in following) {//ensure that connections is a superset of following
            expect(keys).toContain(k);
        }
    })
})