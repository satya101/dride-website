var admin = require('firebase-admin');

anonymizer = {
    /*
     * change the user profile and name by his desire to be anonymous or not.
     */
    start: function(needToAnonymise, uid) {

        if (!needToAnonymise) {
            //update profile back to original state
            return admin.auth().getUser(uid)
              .then(function(userRecord) {
                var user = userRecord.toJSON()
                return admin.auth().updateUser(uid, {
                            displayName: user.providerData[0].displayName,
                            photoURL: user.providerData[0].photoURL
                        })
                        .then(function(userRecord) {
                            var db = admin.database();
                            var ref = db.ref("userData").child(uid)
                            var newDetailsObj = {
                                'photoURL': user.providerData[0].photoURL,
                                'pic': user.providerData[0].photoURL,
                                'name': user.providerData[0].displayName
                            }
                            ref.update(newDetailsObj)


                })
                .catch(function(error) {
                    console.log("Error updating user:", error);
                });

              })
              .catch(function(error) {
                console.log("Error fetching user data:", error);
              });

        } else {

            //pick an avatar and a username
            var db = admin.database();
			var ref = db.ref("userData").child(uid)
			var randN = anonymizer.getRandomArbitrary(1, 5);
            var newDetailsObj = {
                'photoURL': 'https://storage.googleapis.com/dride-2384f.appspot.com/assets/profilePic/pic' + randN + '.png',
                'pic': 'https://storage.googleapis.com/dride-2384f.appspot.com/assets/profilePic/pic' + randN + '.png',
                'name': anonymizer.getRandomName()
            }
            ref.update(newDetailsObj)

            return admin.auth().updateUser(uid, {
                    displayName: newDetailsObj.name,
                    photoURL: newDetailsObj.pic
                })
                .catch(function(error) {
                    console.log("Error updating user:", error);
                });


        }

    },
    getRandomArbitrary: function(min, max) {
        return parseInt(Math.random() * (max - min) + min);
    },
    getRandomName: function() {
		var nickNames = ["The Watch Dog", "The Snake", "The Worm", "The Vipe", "The Peregrine", "The Mongoose", "Wake me", "Shake me", "The Mouthpiece", "Mr. Flathead", "T.V.", "Poison", "Instant Ivo", "Big Daddy", "Big", "The Rat", "The Zookeeper", "Moe", "The Mangler", "Onthegas", "The Natural", "The Hunter", "Also Ran", "Digger Dan", "Mad Dog", "Superman", "Floyd Lippencott Jr.", "Wolfagator", "Wavemaker", "The Bone", "Mr C", "Stormin' Normin", "Billy the Kid", "The Beard", "The King", "The Ace", "The Snowman", "The Wolverine", "The Greek", "The Lizard", "Sneaky Pete", "The Loner", "Bitchin Stichin", "The Iceman", "The Black Knight", "Worlds Fastest Austrian", "The Whip", "GO", "Wild Bill", "Worlds Fastest Mexican", "Flamin' Frank", "Jet Car Bob", "Parachute Potter", "Dirty Eddie", "Wally Gator", "Q-Ball", "Hey Bale", "Broadway Freddy", "Israeli Rocket", "Jazzy", "The Kid", "The Silver Fox", "Shakey Jake", "The Beard", "Rollo", "Pineapple", "Hop Sing", "Jumpin Jeep", "Kansas John", "The Bushmaster", "The Wizard", "Two Motor", "The Kid", "The Lizard", "Cha-Cha", "Hawkeye", "Dog-Breath Grogan", "Fuel Rivet", "Lash", "King Richard ", "The Sarge", "Back Door Bob", "Mandrill", "Cheatin' Chico", "Computerized Driver", "Bounty Hunter", "Ratchet Jaw", "World’s Fastest Disc Jockey", "Swingin' Sammy", "Gentleman Joe", "The Count", "The Spy", "Tarzan", "Ma", "The Mood", "Goober", "Little Tommy", "Mad Dog", "Northwest Terror", "Smilin' Okie", "Kamakazi", "Playboy", "The Colonel", "The Green Kid", "Art the Dart", "The Bakersfield Flash", "Jungle Larry", "Jersey Jew", "Baby Huey", "Sonoma Flash", "Go Fast", "Starvin' Marvin", "Fast Eddie", "The Thrill", "The Snipe", "240 Gordie", "Collector", "Rapid Red", "The Tinman,", "Kansas Tom", "Red Light", "Big John", "The Preacher", "Joe The Jet", "Bolt Loose", "Hand Grenade Harry", "Sandman", "The Bear", "Fat Belly. The Shadow", "King of Garden Grove", "PF Flyer", "Pattyfaster", "The Action Man", "The Beachcomer", "Spendo", "Techno Tim", "Cement Foot", "Shorty", "Roger Ramjet", "Fearless Fred", "240 Shorty", "Stich", "Crud", "Pit Crew Pete", "Joltin Joe", "Smokey", "Tricks", "Kranberry", "The Flake", "Lefty", "Gleasy", "Leiderhouser", "Ol' Man", "The Prune", "Slam'n Sammy", "Smoky Joe", "Red", "Beachball", "Tuna ", "The Whip", "Fireball", "Slick Nick", "Big Bird", "Mums", "Curly", "Snag", "Mad Man", "Big Dog", "Fugowie Howie", "Short Dog", "Giant Jim", "Wheelie", "- Glen Ely", "Carpet Bagger", "Dennis Back-Up", "Ridge Route Terror", "Blogun", "Big Wave", "The Dude", "Cannoball", "Keystone Cop", "Bubble Gum", "Handsome", "''Hand Grenade", "South Philly", "Roger Dodger", "The Foot", "Fuel-n-Farmer", "The Kid", "The Wolf", "Dangerous Dan", "Captain", "The Surfer", "Smoken Joe", "Bushhead", "Big Jim", "Fireman", "Louisville Lip", "Honest John", "Jitters", "Batman", "Snidley Whiplash", "Hole Shot", "Ratchet Mouth", "Nitro Neil", "The Flea", "Bondo Jim", "Sand Shark", "Giant Killer", "Jack Be Nimble", "Nitro Nick", "Nasty", "Wyatt Earp", "Fast Freddy", "Fox", "The Joker", "Rackoon", "Blazin' Hazen", "Ambassador", "Mauser", "The Beard", "Brutus", "Aussie Dave", "Fast Jack", "The Spoiler", "Panzerman", "The Fuse", "Mr. Magoo", "Hot Rod", "Carolina Easter Bunny", "The Old Master", "Emory Cook", "Kama Kazi", "The Flea", "Mad Dog", "The Duck", "The Hangman", "Captain Eddie", "Moline Mad Man", "American Flyer", "Havoc", "Tall Grass", "Little Stick", "Huggy-Boy", "The Dealer", "Nose-Bleed", "Engine Eddie", "The Punky Kid", "Dusty", "The Strangler", "Willard of Warsaw", "Dizzy", "The Buzzard", "Ready Teddy", "Fang", "Sleepy Melvin", "Hook", "Red Baron", "Sly Fox", "Who?", "Fast Freddy", "Nottle at the Throttle", "Unsinkable", "Gentleman Hank", "Supershoe", "The Bomber", "Chicken Hawk", "Stone Age Man", "Atlas", "Moving Van", "Panther", "Papa Bear", "Golden Boy", "The Captain", "The Ambassador", "Cement Head", "Terrible Ted", "Buffalo Bob", "Big Bob", "Den of Iniquity", "Beserk Buzzard", "Fast Eddie", "Dyno Don", "The DC Lip", "The Farmer", "The All American Boy", "Jungle Jim", "- Jim Liberman", "Snag", "Okie", "Sparky", "Boogie", "Bubba", "Skinhead", "Shooter Doug", "The Tyrant", "Waco Willie", "“Diamond Dave", "Sarge", "Hook", "Lawnmower Man", "The Rookie", "Frantic Phil", "Flyin' Hawaiian", "Crazy Jake", "Killer", "Huggy Bear", "Charlie Bongo", "Hairy", "Atlas", "The Snail", "Charg'n Charlie", "Florida Thief", "Wild Bill", "The Worm", "Puddin", "Third Finger", "Sideways", "Eddie Munster", "Rapid Ronnie", "World's Fastest Hippie"]
        return nickNames[parseInt(Math.random() * (nickNames.length))];
    }
}

module.exports = anonymizer;
