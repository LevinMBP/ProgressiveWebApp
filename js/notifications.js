import playlistDbCloud from "../api/playlist-db-cloud.js";

const notificationBtn = document.getElementById('notificationBtn');
const showNotifBtn = document.getElementById('showNotifBtn');

const notificationBtnWrap = document.getElementById('notifBtnWrapper');
const formWrap = document.getElementById('formWrapper');

const notifTitle = document.getElementById('notifTitle');
const notifBody = document.getElementById('notifBody');

const notifErrMsg = document.getElementById('notifErrMsg');
const notifSuccMsg = document.getElementById('notifSuccMsg');
const notifresponse = document.getElementById('notifresponse');

if ("Notification" in window && "serviceWorker" in navigator) {

    // The ready property delays the code execution of the app until the service worker is active.
    // It returns a Promise that NEVER rejects and which waits indefinitely until service worker is active
    navigator.serviceWorker.ready
        .then((registration) => {
            console.log("[NS] Active")

            const controller = registration.active
            if (controller) {
                // Receives message from service worker
                navigator.serviceWorker.addEventListener('message', (message) => {
                    console.log(message.data)
                    // alert(message.data)
                })
            }


        })


    // console.log("[SF] Current Permission:  ", Notification.permission);
    const currentPermission = Notification.permission;
    if (currentPermission === "granted") {
        hideDOM(notificationBtnWrap);

    }
    else if (currentPermission === 'default') {
        hideDOM(formWrap);
    }
    else {
        hideDOM(formWrap);
        notificationNotAllowed();
    }

    // Only if Notification && serviceWorker are true add addeventlistener 
    notificationBtn.addEventListener('click', (event) => {

        event.preventDefault();
        // console.log("Permission: ", Notification.permission);

        switch (Notification.permission) {
            case 'default':
                requestUserPermission();
                break;
            case 'granted':
                displayNotification()
                break;
            case 'denied':
                notificationNotAllowed();
                break;
        }
    })
}
else {
    notificationNotAllowed();
    hideDOM(formWrap);
}


// Request the users permission to send notifications
function requestUserPermission() {
    // console.log("Requesting Permission...");

    Notification.requestPermission()
        .then((permission) => {

            // console.log("User Choice: ", permission);
            if (permission === 'granted') {

                hideDOM(notificationBtnWrap);
                showDOM(formWrap);

                // Subscribe the device to receive push messages
                configurePushSubscription();
            }
        })
}

function notificationNotAllowed() {
    // If user choose to block permission
    // disables button
    notificationBtn.disabled = true;
    notificationBtn.style.backgroundColor = "#cccccc";
    notificationBtn.style.borderColor = "#999999";
    notificationBtn.style.color = "#888888";
}

function hideDOM(elem) {
    elem.style.display = 'none';
}

function showDOM(elem) {
    elem.style.display = '';
}

// Display a notification
function displayNotification() {
    console.log("Showing Notification...");

    if (notifTitle.value == "") {
        notifErrMsg.classList.add("show");
        return
    }

    const options = {
        body: notifBody.value || "Thank you for subscribing to our notifications",
        icon: "../assets/images/playlistlogo.png",
        image: "../assets/images/thank-you.jpg",
        // actions can only be applied if notifications are being rendered by serviceworker
        actions: [
            {
                action: 'confirm',
                title: 'Okay',
                icon: '../assets/images/ok.png'
            },
            {
                action: 'cancel',
                title: 'Cancel',
                icon: '../assets/images/cancel.png'
            }
        ],
        data: {
            title: "Dummy",
            body: "hotdog"
        }
    }
    // Can not apply actions to this Notification
    // new Notification('Successfully Subscribed', options);

    // ServiceWorker notification 
    navigator.serviceWorker.ready
        .then((registration) => {
            registration.showNotification(notifTitle.value, options);
        })
    notifTitle.value = ""
    notifBody.value = ""
}

// Subscribe the device to receive push messages
async function configurePushSubscription() {
    try {

        // PushManager interface provides a way to receive notifications from third-party servers
        const registration = await navigator.serviceWorker.ready;
        const pushManager = registration.pushManager;

        // Returns an object containing details of existing subscription
        // Retiurns null if user is not subscribed
        let getSubscription = await pushManager.getSubscription();
        if (getSubscription === null) {
            // https://vapidkeys.com/
            const publicKey = "BF03c7t3TQ8vZCVV0ixTNs_bXyBTahpvVNTxzt4ex_F5AcGfLFfXLEBJPhQ-pKZ2pGez72pigH0dyPrj2Jocgr4";
            const options = {
                userVisibleOnly: true,
                applicationServerKey: publicKey,
            }
            // Createsa new push subscription
            getSubscription = await pushManager.subscribe(options);

            // If new subscription is created.
            // Needs to save to database
            await playlistDbCloud.open();
            await playlistDbCloud.subscribe(getSubscription);
            console.log("Subscription Saved!");
        }
        // Goes here if Client is already subscribed.
        // Does not need to save to db if Client already subscribed.
        console.log("Subscription: ", getSubscription);
    }
    catch (err) {
        console.log(err)
    }
}

showNotifBtn.addEventListener('click', (event) => {
    event.preventDefault();
    displayNotification();
})

notifTitle.addEventListener('input', () => {
    notifErrMsg.classList.remove('show');
    notifSuccMsg.classList.remove('show');
    notifErrMsg.style.display = "none";
    notifSuccMsg.style.display = "none";
});
