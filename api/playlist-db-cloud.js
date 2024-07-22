import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js'


class Playlist {
    constructor() {
        this.db = null;
        this.isAvailable = false;
    }

    open() {
        return new Promise((resolve, reject) => {
            try {
                // Your web app's Firebase configuration
                const firebaseConfig = {
                    apiKey: "AIzaSyC8enD3yEqQTvcsC8c9YSDiWflbWc-A8zA",
                    authDomain: "musicapp-71bbf.firebaseapp.com",
                    projectId: "musicapp-71bbf",
                    storageBucket: "musicapp-71bbf.appspot.com",
                    messagingSenderId: "308432336164",
                    appId: "1:308432336164:web:ee4db99af05322d1fcafb1"
                };

                // Initialize Firebase
                const app = initializeApp(firebaseConfig);

                // Initialize Cloud Firestore and get a reference to the service
                const db = getFirestore(app);

                if (db) {
                    this.db = db;
                    this.isAvailable = true;
                    resolve();
                }
                else {
                    reject('Database not available');
                }

            }
            catch (err) {
                reject(err.message);
            }
        })

    }

    add(title, artist, likes = 0) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject("Database not connected");
            }

            // Create Playlist object to be added
            const track = { title, artist, likes };

            // Connect to Firebase Collection
            const dbCollection = collection(this.db, 'Playlist');

            // Adds new Playlist object to the collection
            addDoc(dbCollection, track)
                .then((docRes) => {
                    console.log("Doc response: ", docRes.id);
                    resolve();
                })
                .catch((err) => {
                    reject(err.message)
                })
        });
    }

    getAll() {
        // return new Promise((resolve, reject) => {
        //     if (!this.isAvailable) {
        //         reject("Database not connected");
        //     }

        //     // Connect to Firebase Collection
        //     const dbCollection = collection(this.db, 'Playlist');

        //     getDocs(dbCollection)
        //         .then((snapshot) => {
        //             console.log("snap: ", snapshot);
        //         })
        //         .catch((err) => {
        //             reject(err.message)
        //         })
        // })
        if (!this.isAvailable) {
            console.log("Database not connected");
            return
        }
        const getData = async () => {
            const querySnapshot = await getDocs(collection(this.db, "Playlist"));
            const playlist = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                playlist.push(data);
            });
            return playlist
        }
        return getData();
    }

    updateLike(id) {
        console.log("Update like");
        console.log(id)
        if (!this.isAvailable) {
            console.log("Database not connected");
            return
        }
        const addLike = async () => {
            const dbCollection = collection(this.db, 'Playlist');

            // The following example shows how to retrieve the contents of a single document using get():
            const docRef = doc(this.db, "Playlist", id);
            const docSnap = await getDoc(docRef);

            // https://firebase.google.com/docs/firestore/query-data/get-data?authuser=1#get_a_document
            if (docSnap.exists()) {
                const data = docSnap.data();
                const updateLike = data.likes + 1;
                // Updates collection
                // Need to populate previous data e.g. Artist, Title
                // otherwise other properties will be undefined
                await setDoc(doc(dbCollection, id), { ...data, likes: updateLike })
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No record found");
            }

        }

        return addLike();
    }

    delete(id) {
        console.log("deleted");
        if (!this.isAvailable) {
            console.log("Database not connected");
            return
        }

        const deleteTrack = async () => {
            await deleteDoc(doc(this.db, "Playlist", id));
        }
        return deleteTrack();
    }

    subscribe(subscription) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject("Database not opened");
            }

            // Connect to db then add subscription
            const dbCollection = collection(this.db, 'Subscriptions');
            addDoc(dbCollection, { subscription: JSON.stringify(subscription) })
                .then((docRes) => {
                    console.log("Doc response: ", docRes.id);
                    resolve();
                })
                .catch((err) => {
                    reject(err.message)
                })
        })
    }

}

export default new Playlist();