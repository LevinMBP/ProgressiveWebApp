const output = document.getElementById('device-output');


document.getElementById('feature-selector').addEventListener('click', function (event) {
    const selectedOption = event.target.value
    output.innerText = "Selected Option: " + selectedOption;
    console.log(event.target.text)
    console.log(this.options[this.selectedIndex].text)
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
            handleDeviceFeatureSelector(selectedText);
            break;
        case 'screen-wake-lock':
            handleDeviceFeatureSelector(selectedText);
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
    output.innerText = "Network Information...";
    if ('connection' in navigator) {
        console.log('Connection: ', navigator.connection);
    }
}

function handleFullscreenAPI() {
    output.innerText = "Network Information...";
}

function handleScreenOrientationAPI() {
    output.innerText = "Network Information...";
}

function handleVibration() {
    output.innerText = "Network Information...";
}

function handlePageVisibility() {
    output.innerText = "Network Information...";
}