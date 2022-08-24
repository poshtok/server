let people: [Character: [Character]] = [
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "D", "F"],
    "D": ["B", "C", "E"],
    "E": ["B", "D", "F"],
    "F": ["C", "E"]
]

func mostCommonFriends(compareFriend: Character) -> Character {
    var dict: [Character: Int] = [:] // Person : Count of Common Friends
    let friendsToSearchFor: Set<Character> = Set(people[compareFriend]!)
    
    for person in people.keys where person != compareFriend {
        guard let friends = people[person] else { continue }
        
        let friendSet: Set<Character> = Set(friends)
        let similarFriends = friendsToSearchFor.intersection(friendSet)
        let count = similarFriends.count
        dict[person] = count
    }
    
    for person in dict.keys {
        let count = dict[person]
        if count == dict.values.max() {
            return person
        }
    }
    return "-"
}