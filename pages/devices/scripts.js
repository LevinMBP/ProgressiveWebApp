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
            handleDeviceFeatureSelector(selectedText);
            break;
        case 'permissions':
            handleDeviceFeatureSelector(selectedText);
            break;
        case 'accelerometer':
            handleDeviceFeatureSelector(selectedText);
            break;
        case 'linear-acceleration':
            handleDeviceFeatureSelector(selectedText);
            break;
        case 'gyroscope':
            handleDeviceFeatureSelector(selectedText);
            break;
        case 'gravity':
            handleDeviceFeatureSelector(selectedText);
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
    output.innerText = "Network Information...";
}

function handleIdleDetection() {
    output.innerText = "Network Information...";
}

function handleScreenWakeLock() {
    output.innerText = "Network Information...";
}