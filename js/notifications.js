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

    navigator.serviceWorker.ready
        .then((registration) => {

            const controller = registration.active
            console.log("[SW] Controller is active", controller);
            // controller.postMessage("[PS] Registration is active")

            // Receives message from service worker
            navigator.serviceWorker.addEventListener('message', (message) => {
                console.log(message.data)
                alert(message.data)
            })
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
        // console.log("Subscribed!!")
        event.preventDefault();
        console.log("Permission: ", Notification.permission);

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
}


// Request the users permission to send notifications
function requestUserPermission() {
    console.log("Requesting Permission...");
    Notification.requestPermission()
        .then((permission) => {
            console.log("User Choice: ", permission);
            if (permission === 'granted') {
                hideDOM(notificationBtnWrap);
                showDOM(formWrap);
            }
        })
}

function notificationNotAllowed() {
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
        icon: "/assets/images/playlistlogo.png",
        image: "/assets/images/thank-you.jpg",
        // actions can only be applied if notifications are being rendered by serviceworker
        actions: [
            {
                action: 'confirm',
                title: 'Okay',
                icon: '/assets/images/ok.png'
            },
            {
                action: 'cancel',
                title: 'Cancel',
                icon: '/assets/images/cancel.png'
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
function configurePushSubscription() {
    navigator.serviceWorker.ready
        .then((registration) => {
            const pushManager = registration.pushManager;
        })
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
