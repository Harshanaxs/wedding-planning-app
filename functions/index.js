const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.addAdminRole = functions.https.onCall((data, context) => {
  firebase;
  // get user and add admin custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin.`
      };
    })
    .catch(err => {
      return err;
    });
});

exports.onUserCreate = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap, context) => {
    const values = snap.data();
    console.log(values);
    var exArr = [];
    await db
      .collection("messages")
      .where("userId", "==", values.userId)
      .where("vendorId", "==", values.vendorId)
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot.docs.length + "This is length");
        if (querySnapshot.docs.length === 1) {
          db.collection("messages").add({
            message: `Hi ${values.userName}. We Contact You Soon when we are online`,
            userName: values.userName,
            createdAt: admin.firestore.Timestamp.fromDate(new Date()),
            sender: values.vendorId,
            vendorId: values.vendorId,
            userId: values.userId
          });
        } else {
          console.log("already satisfied !!");
        }

        return querySnapshot;
      })
      .catch(err => console.log("Error :" + err));

    // send email
  });
