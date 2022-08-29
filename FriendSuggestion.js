//This using depth search in JavaScript.
class GetSuggestFriends {
 

    constructor() {
        this.adj = new Map();
        this.groups = new Set();
    }


	addFriendship(a, b) {
        if (this.adj.get(a) == null)
            this.adj.set(a, new Array());
        if (this.adj.get(b) == null)
            this.adj.set(b, new Array());      		
        this.adj.get(a).push(b);
        this.adj.get(b).push(a);		
	}
	
	//Find group by connections, DFS,
  total number of people,
	findGroups() {
		let visited = new Map();
		for (let entry of this.adj.entries()) {
            let t = entry[0]
            if (visited.get(t) == null) {
            	let group = new Set();
                this.dfs(t, visited, group);
                this.groups.add(group);
            }
        }
	}
	
	//DFS
	dfs(v, visited, group) {
		visited.set(v, true);
        group.add(v);
		for (let ne of this.adj.get(v)) {
			if (visited.get(ne) == null)
				this.dfs(ne, visited, group);
		}
	}
//Find suggest friends, 
    getSuggestedFriends (a) {
		if (this.groups.size == 0)
			this.findGroups();
		var res = new Set();
		for (let t of this.groups) {
			if (t.has(a)) {               
				res = t;             
				break;
			}
		}       
		if (res.size &gt; 0) //remove himself from suggested friends
			res.delete(a);
		for (let t of this.adj.get(a)) //remove already known friends from result
            res.delete(t);
		return res;
	}
}
 
let g = new GetSuggestFriends();
g.addFriendship("Amy", "Chris");
g.addFriendship("Sarah", "Joshua");
g.addFriendship("Joshua", "Zoe");
g.addFriendship("Sarah", "Jess");
g.addFriendship("Amy", "Sam");
 
var givenName = "Zoe";
console.log("Suggestion friends of " + givenName + ":");
console.log(g.getSuggestedFriends(givenName));	
 
givenName = "Sam

 
