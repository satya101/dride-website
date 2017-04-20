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
            var newDetailsObj = {
                'pic': 'https://storage.cloud.google.com/dride-2384f.appspot.com/assets/profilePic/pic' + anonymizer.getRandomArbitrary(1, 5) + '.png',
                'name': 'Rider' + anonymizer.getRandomArbitrary(1, 500)
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
    }

}

module.exports = anonymizer;
