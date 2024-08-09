const output = document.getElementById('device-output');


document.getElementById('feature-selector').addEventListener('change', function (event) {
    const selectedOption = event.target.value

    // console.log(event.target.text)
    // console.log(this.options[this.selectedIndex].text)
    const selectedText = this.options[this.selectedIndex].text

    switch (selectedOption) {
        case 'battery':
            handleBatteryStatusAPI();
            break;
        case 'network-info':
            handleNetworkInformation();
            break;
        case 'fullscreen':
            handleFullscreenAPI();
            break;
        case 'screen-orientation':
            handleScreenOrientationAPI();
            break;

        case 'vibration':
            handleVibration();
            break;
        case 'page-visibility':
            handlePageVisibility();
            break;
        case 'idle-detection':
            handleIdleDetection();
            break;
        case 'screen-wake-lock':
            handleScreenWakeLock();
            break;
        case 'geolocation':
            handleGeolocation();
            break;
        case 'permissions':
            handlePermissionsAPI();
            break;
        case 'accelerometer':
            handleAccelerometer();
            break;
        case 'linear-acceleration':
            handleLinearAcceleration();
            break;
        case 'gyroscope':
            handleGyroscope();
            break;
        case 'gravity':
            handleGravity();
            break;




        default:
            output.innerText = "No feature selected";
            break;
    }

})

async function handleBatteryStatusAPI() {
    if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();

        const batteryChargin = battery.charging ? "Yes" : "No";
        const batteryLevel = (battery.level * 100).toFixed(0) + "%";

        const renderBatteryInfo = () => {
            output.innerHTML = `
            <div>
                Battery Charging:
                <strong>${batteryChargin}</strong>
            </div>
            <div>
                Battery Level:
                <strong>${batteryLevel}</strong>
            </div>
        `;
        }

        // Initialize battery info
        renderBatteryInfo();

        battery.addEventListener('chargingchange', () => {
            console.log("Battery Charging: ", battery.charging);
            renderBatteryInfo();
        })


        battery.addEventListener('levelchange', () => {
            console.log("Battery Charging: ", battery.level);
            renderBatteryInfo();
        })
    }
    else {
        output.innerText = "Battery API not supported on this device";
    }
}

function handleNetworkInformation() {

    if ('connection' in navigator) {
        console.log('Connection: ', navigator.connection);

        const writeNetworkInfo = () => {

            const networkType = navigator.connection.type || "unknown";
            const networkEffectiveType = navigator.connection.effectiveType || "unknown";
            const networkDownlink = navigator.connection.downlink || "unknown";
            const networkDownlinkMax = navigator.connection.downlinkMax || "unknown";

            output.innerHTML = `
                <div>
                    Current network type: 
                    <strong>${networkType}</strong>
                </div>
                <div>
                    Cellular connection type:
                    <strong>${networkEffectiveType}</strong>
                </div>
                <div>
                    Estimated bandwidth:
                    <strong>${networkDownlink}</strong> Mbps
                </div>
                <div>
                    Maximum downlink:
                    <strong>${networkDownlinkMax}</strong> Mbps
                </div>
            `;
        }

        // Initialize network info
        writeNetworkInfo();

        navigator.connection.addEventListener('change', () => {
            writeNetworkInfo();
        })
    }
    else {
        output.innerText = "Network Information not available";
    }
}

function handleFullscreenAPI() {

    if ('fullscreenElement' in document && 'exitFullscreen' in document) {
        // Create the helper elements
        const button = document.createElement('button');
        button.innerText = 'Togge Fullscreen';
        output.appendChild(button);

        const message = document.createElement('div');
        message.innerText = 'Click on the button above';
        output.appendChild(message);

        button.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                // Using document getelemid to full screen on a scpecifil element
                // document.getElementById().requestFullscreen()
                document.documentElement.requestFullscreen()
                    .then(() => {
                        message.innerText = "You are on fullscreen mode now";
                    });
            }
            else {
                document.exitFullscreen()
                    .then(() => {
                        message.innerText = "You left the fullscreen mode";
                    });
            }
        })
    }
    else {
        output.innerText = "Fullscreen not available or enabled on this device...";
    }
}

function handleScreenOrientationAPI() {
    if ('screen' in window && 'orientation' in screen) {
        //  Create the helper elements
        const buttonLockPortrait = document.createElement('button');
        buttonLockPortrait.innerText = "Lock Portrait";
        output.appendChild(buttonLockPortrait);

        const buttonLockLandscape = document.createElement('button');
        buttonLockLandscape.innerText = "Lock Landscape";
        output.appendChild(buttonLockLandscape);

        const buttonUnlock = document.createElement('button');
        buttonUnlock.innerText = "Unlock";
        output.appendChild(buttonUnlock);

        const message = document.createElement('div');
        message.innerText = "Choose an option above";
        output.appendChild(message);

        buttonLockPortrait.addEventListener('click', () => {
            screen.orientation.lock('portrait-primary')
                .then(() => {
                    message.innerText = "Locked to portrait";
                })
                .catch((err) => {
                    message.innerText = `Lock error: ${err}`;
                })
        })

        buttonLockLandscape.addEventListener('click', () => {
            screen.orientation.lock('landscape-primary')
                .then(() => {
                    message.innerText = "Locked to landscape";
                })
                .catch((err) => {
                    message.innerText = `Lock error: ${err}`;
                })
        })

        buttonUnlock.addEventListener('click', () => {
            screen.orientation.unlock();
            message.innerHTML = "Orientation unlocked";
        })

    }
    else {
        output.innerText = "Screen orientation not available";
    }
}

function handleVibration() {
    if ('vibrate' in navigator) {
        // Create the helper elements
        const buttonSingle = document.createElement('button');
        output.appendChild(buttonSingle);
        buttonSingle.innerText = "Single Vibration";

        const buttonMultiple = document.createElement('button');
        output.appendChild(buttonMultiple);
        buttonMultiple.innerText = "Single Vibration";

        buttonSingle.addEventListener('click', () => {
            // Vibrate for 200ms
            navigator.vibrate(200);
        })

        buttonMultiple.addEventListener('click', () => {
            navigator.vibrate([200, 100, 200, 300, 600]);
        })
    }
    else {
        output.innerText = "Vibration is not supported on this device";
    }
}

function handlePageVisibility() {
    console.log("Visibility: ", document.visibilityState);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            Notification.requestPermission((permission) => {
                if (permission === 'granted') {
                    console.log("Permission: ", permission)
                    navigator.serviceWorker.ready
                        .then((registration) => {
                            console.log("it is ready")
                            registration.showNotification("You are idle with our app", {
                                body: "We'll be waiting here",
                                icon: "/assets/images/playlistlogo.png"
                            })
                        })
                        .catch((err) => {
                            console.log("SW Error: ", err)
                        })
                }
            })
        }
        else {
            output.innerHTML = "Welcome Back";
        }
    })
}

async function handleIdleDetection() {

    if ('IdleDetector' in window) {
        const permission = await IdleDetector.requestPermission();
        if (permission === 'granted') {
            // Creates a new IdleDetector Object
            const idleDetector = new IdleDetector();

            // Helper function
            const writeState = () => {
                output.innerHTML = `
                    <div>User State: <b>${idleDetector.userState}</b>.</div>
                    <div>Screen State: <b>${idleDetector.screenState}</b>.</div>
                `
            }

            await idleDetector.start({ threshold: 60000 });
            writeState();

            idleDetector.addEventListener('change', () => {
                console.log("Detector Object: ", idleDetector);
            })
        }
    }


}

async function handleScreenWakeLock() {
    if ('wakeLock' in navigator) {
        // This will prevent the device from locking
        const sentinel = await navigator.wakeLock.request('screen')
        output.innerHTML = `
            <div>Wake Lock is Active!</div>
        `;

        // Create a button to release the lock
        const button = document.createElement('button');
        button.innerText = "Release Screen";
        output.append(button);

        button.addEventListener('click', async () => {
            await sentinel.release();
            output.innerHTML = `
                Wake Lock deactivated. <br />
                The Screen was released!
            `;
        })
    }
    else {
        output.innerText = "Screen wake lock API not supported on this device";
    }
}

function handleGeolocation() {
    if ('geolocation' in navigator) {
        // Get current position
        navigator.geolocation.getCurrentPosition(
            // on success callback
            (position) => {
                console.log("CUrrent Position: ", position);
                output.innerHTML = `
                    <strong>Current Position:</strong>
                    <div>Latitude: ${position.coords.latitude}</div>
                    <div>Longtitude: ${position.coords.longitude}</div>
                    <div>More or Less: ${position.coords.accuracy} meters</div>
                `;
            },

            // on error callback
            (err) => {
                console.log("Current Position Error: ", err);
                output.innerText = 'Geolocation failed to get the current position';
            }
        );

        // Watch when position change
        navigator.geolocation.watchPosition(
            // On success callback
            (position) => {
                console.log("Watching Position: ", position);
                output.innerHTML = `
                    <strong>Watching Position:</strong>
                    <div>Latitude: ${position.coords.latitude}</div>
                    <div>Longtitude: ${position.coords.longitude}</div>
                    <div>More or Less: ${position.coords.accuracy} meters</div>
                `;
            },
            // Error callback
            (err) => {
                console.log("Watch Position Error: ", err);
                output.innerText = 'Geolocation failed to get the watch position';
            }
        )
    }
    else {
        output.innerText = "Geolocation API not available on this device";
    }
}

async function handlePermissionsAPI() {
    if ('permissions' in navigator) {
        const permissionStatus = await navigator.permissions.query({
            name: "geolocation",
            userVisibleOnly: true // only necessary for push api
        })

        output.innerHTML = `Status for <b>${permissionStatus.name}</b>: ${permissionStatus.state}`

        // Watch for changes on the permissions
        permissionStatus.addEventListener('change', (event) => {
            console.log(event);
        })

    }
    else {
        output.innerText = "Permission API not available on this device";
    }
}

async function handleAccelerometer() {
    // Validates sensor API
    if (!('Accelerometer' in window)) {
        output.innerText = "Accelerometer not available on this device";
        return;
    }

    if (!('permissions' in navigator)) {
        output.innerText = "Permission API not available on this device";
        return;
    }

    // Validate the accelerometer permission
    const accelerometerPermission = await navigator.permissions.query({
        name: 'accelerometer'
    })

    if (accelerometerPermission.state !== 'granted') {
        output.innerText = "You are not authorized to use accelerometer sensor";
        return;
    }

    // Declare the sensor variable
    let accelerometer
    try {
        accelerometer = new Accelerometer({
            referenceFrame: 'device'
        });
    }
    catch (err) {
        output.innerText = 'Accelerometer error: ' + err;
        return;
    }

    // Listening for errors thrown during its use
    accelerometer.addEventListener('error', (event) => {
        const errMsg = event.error;
        output.innerText = 'Accelerometer failed: ' + errMsg;
    })

    // The reading event is fired when a new reading is available on a sensor
    accelerometer.addEventListener('reading', () => {
        console.log(accelerometer);

        const axisX = accelerometer.x.toFixed(2);
        const axisY = accelerometer.y.toFixed(2);
        const axisZ = accelerometer.z.toFixed(2);

        message.innerHTML = `
            <div>Acceleration along the:</div>
            <ul>
                <li>X-axis is <b>${axisX}</b> m/s<sup>2</sup></li>
                <li>Y-axis is <b>${axisY}</b> m/s<sup>2</sup></li>
                <li>Z-axis is <b>${axisZ}</b> m/s<sup>2</sup></li>
            </uil>
        `;
    })

    // Create the helper elements
    const buttonStart = document.createElement('button');
    buttonStart.innerText = 'Start';
    output.appendChild(buttonStart);

    const buttonStop = document.createElement('button');
    buttonStop.innerText = 'Stop';
    buttonStop.disabled = true;
    output.appendChild(buttonStop);

    const message = document.createElement('div');
    message.innerText = 'Click on the start button above';
    output.appendChild(message);

    // Start the sensor
    buttonStart.addEventListener('click', () => {
        try {
            accelerometer.start();
            buttonStop.disabled = false;
            buttonStart.disabled = true;
        }
        catch (err) {
            message.innerText = "itwas not possible to start the sensor: " + err;
        }
    })

    // Stop the sensor
    buttonStop.addEventListener('click', () => {
        try {
            accelerometer.stop();
            buttonStop.disabled = true;
            buttonStart.disabled = false;
        }
        catch (err) {
            message.innerText = "itwas not possible to stop the sensor: " + err;
        }
    })

}

async function handleLinearAcceleration() {
    // Validates sensor API
    if (!('LinearAccelerationSensor' in window)) {
        output.innerText = "LinearAccelerationSensor not available on this device";
        return;
    }

    if (!('permissions' in navigator)) {
        output.innerText = "Permission API not available on this device";
        return;
    }

    // Validate the accelerometer permission
    const linearAccelerometerPermission = await navigator.permissions.query({
        name: 'accelerometer'
    })

    if (linearAccelerometerPermission.state !== 'granted') {
        output.innerText = "You are not authorized to use linear acceleration sensor";
        return;
    }

    // Declare the sensor variable
    let linearAccelerometer
    try {
        linearAccelerometer = new LinearAccelerationSensor({
            referenceFrame: 'device'
        });
    }
    catch (err) {
        output.innerText = 'linear acceleration error: ' + err;
        return;
    }

    // Listening for errors thrown during its use
    linearAccelerometer.addEventListener('error', (event) => {
        const errMsg = event.error;
        output.innerText = 'linearAccelerometer failed: ' + errMsg;
    })

    // The reading event is fired when a new reading is available on a sensor
    linearAccelerometer.addEventListener('reading', () => {
        console.log(linearAccelerometer);

        const axisX = linearAccelerometer.x.toFixed(2);
        const axisY = linearAccelerometer.y.toFixed(2);
        const axisZ = linearAccelerometer.z.toFixed(2);

        message.innerHTML = `
            <div>Acceleration along the:</div>
            <ul>
                <li>X-axis is <b>${axisX}</b> m/s<sup>2</sup></li>
                <li>Y-axis is <b>${axisY}</b> m/s<sup>2</sup></li>
                <li>Z-axis is <b>${axisZ}</b> m/s<sup>2</sup></li>
            </uil>
        `;
    })

    // Create the helper elements
    const buttonStart = document.createElement('button');
    buttonStart.innerText = 'Start';
    output.appendChild(buttonStart);

    const buttonStop = document.createElement('button');
    buttonStop.innerText = 'Stop';
    buttonStop.disabled = true;
    output.appendChild(buttonStop);

    const message = document.createElement('div');
    message.innerText = 'Click on the start button above';
    output.appendChild(message);

    // Start the sensor
    buttonStart.addEventListener('click', () => {
        try {
            linearAccelerometer.start();
            buttonStop.disabled = false;
            buttonStart.disabled = true;
        }
        catch (err) {
            message.innerText = "itwas not possible to start the sensor: " + err;
        }
    })

    // Stop the sensor
    buttonStop.addEventListener('click', () => {
        try {
            linearAccelerometer.stop();
            buttonStop.disabled = true;
            buttonStart.disabled = false;
        }
        catch (err) {
            message.innerText = "itwas not possible to stop the sensor: " + err;
        }
    })
}

function handleGyroscope() {

}

function handleGravity() {

}