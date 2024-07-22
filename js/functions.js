import playlistDb from "../api/playlist-db-cloud.js";


if ('serviceWorker' in navigator) {
    // https://stackoverflow.com/questions/28789395/difference-between-serviceworker-getregistration-and-serviceworker-ready-then

    // navigator.serviceWorker.register('service-worker.js', { scope: '/' })
    //     .then((res) => {
    //         console.log("Registration Success: ", res);
    //     })
    //     .catch((err) => {
    //         console.log("Registration Failed: ", err);
    //     })

    // The ready property delays the code execution of the app until the service worker is active.
    // It returns a Promise that NEVER rejects and which waits indefinitely until service worker is active
    navigator.serviceWorker.ready
        .then((registration) => {

            const controller = registration.active;
            if (controller) {
                console.log("[FS][SW] Active");

                // Receives message from service worker
                navigator.serviceWorker.addEventListener('message', (message) => {
                    console.log(message.data)
                    alert(message.data)
                })

                // Sends message to service worker
                controller.postMessage("Function Script message to [SW]");
                // controller.postMessage({ 'FS': "My message to [SW]" });
            }


            // // Validate if Background Sync is available
            // if ('sync' in registration) {

            //     // Check if tag name is already registered
            //     registration.sync.getTags()
            //         .then((tags) => {
            //             if (!tags.includes('my-tag-name')) {
            //                 // Register a tagname
            //                 registration.sync.register('my-tag-name')
            //                     .then(() => {
            //                         console.log("tag registered");
            //                     })
            //                     .catch((err) => {
            //                         console.log("unsuccessful registration");
            //                     })
            //             }
            //         })

            // }
            // else {
            //     console.log("Not available background sync");
            // }
        })

    // navigator.serviceWorker.addEventListener('message', (event) => {
    //     console.log("[PS] Message Received: ", event)
    // })
}
else {
    console.log('Service workers not supported.')
}

var myForm = document.getElementById("songForm");

var songInput = document.getElementById("songTitle");
var artistInput = document.getElementById("songArtist");

var errMsg = document.getElementById("errMsg");
var succMsg = document.getElementById("succMsg");

// Event Listeners
window.onload = () => {
    playlistDb.open();
    playlistDb.getAll().then(renderListOfSongs);
}

myForm.addEventListener("submit", event => {
    errMsg.classList.remove("show");
    succMsg.classList.remove("show");
    event.preventDefault();

    if (!songInput.value || !artistInput.value) {
        errMsg.classList.add("show");
        return;
    }

    const submitForm = async () => {

        var formData = new FormData(myForm);

        var data = Object.fromEntries(formData);

        await playlistDb.add(data.songTitle, data.songArtist);

        await playlistDb.getAll().then(renderListOfSongs);
        succMsg.classList.add("show");
        songInput.value = "";
        artistInput.value = "";
    }

    submitForm();
})

songInput.addEventListener('input', removeError);
artistInput.addEventListener('input', removeError);


// Functions
function renderListOfSongs(songs) {

    if (songs) {
        let listSongParent = document.getElementById("listOfSongs");

        listSongParent.innerHTML = "";
        songs.map((song, index) => {

            const likeBtn = createButton("+1 Like", song.id);
            const removeBtn = createButton("Remove", song.id);

            likeBtn.className = "like-btn"
            removeBtn.className = "rem-btn"

            listSongParent.innerHTML += `
                <div class="song-card">
                    <div class="song-card-header">
                        <div class="song-title">
                            <h5>${song.title}</h5>
                        </div>
                        <div class="song-likes">
                            <h5 class="likes-label">Likes: </h5>
                            <h5 class="likes-count">${song.likes}</h5>
                        </div>
                    </div>
                    <div class="song-artist">
                        <h5>${song.artist}</h5>
                    </div>
                    <div class="btn btn-actions-wrapper">
                        <div class="btn btn-remove" id="btn-remove-${index}">
                            
                        </div>
                        <div class="btn btn-like" id="btn-like-${index}">
                            
                        </div>
                    </div>
                </div>
            `
            document.getElementById(`btn-like-${index}`).appendChild(likeBtn);
            document.getElementById(`btn-remove-${index}`).appendChild(removeBtn);
        })

        const likebtns = document.querySelectorAll("button.like-btn");
        const rembtns = document.querySelectorAll("button.rem-btn");

        likebtns.forEach((button, index) => button.addEventListener("click", event => updateLikeFunc(event)));
        rembtns.forEach((button, index) => button.addEventListener("click", event => removeTrackFunc(event)));
    }
}

function removeError() {
    errMsg.classList.remove("show");
    succMsg.classList.remove("show");
}

async function updateLikeFunc(event) {
    var target = event.target || event.srcElement;
    var id = target.id
    playlistDb.updateLike(id);
    await playlistDb.getAll().then(renderListOfSongs);
}

async function removeTrackFunc(event) {
    var target = event.target || event.srcElement;
    var id = target.id
    playlistDb.delete(id);
    await playlistDb.getAll().then(renderListOfSongs);
}

function createButton(text, id) {
    const btnElem = document.createElement('button');
    btnElem.innerText = text;
    btnElem.id = id;
    return btnElem;
}