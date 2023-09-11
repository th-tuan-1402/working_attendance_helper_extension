import { getStorageItem, setStorageItem } from "./ChromeApiHelper";
import { refreshToken } from "./hitoCommonApi";

(async function () {

    let username = await getStorageItem('username') ?? ''

    const usernameInp = document.getElementById('username')
    usernameInp.value = username

    let password = await getStorageItem('password') ?? ''

    const passwordInp = document.getElementById('password')
    passwordInp.value = password

    const chkIsAutoCheckIn = document.getElementById('isAutoCheckIn')
    let isAutoCheckIn = await getStorageItem('isAutoCheckIn') ?? false
    if (isAutoCheckIn) {
        chkIsAutoCheckIn?.setAttribute('checked', 'checked')
    }

    chkIsAutoCheckIn?.addEventListener('change', async () => {
        const value = chkIsAutoCheckIn.checked
        await setStorageItem({isAutoCheckIn: value})
    })

    const chkIsAutoCheckOut = document.getElementById('isAutoCheckOut')
    let isAutoCheckOut = await getStorageItem('isAutoCheckOut') ?? false
    if (isAutoCheckOut) {
        chkIsAutoCheckOut?.setAttribute('checked', 'checked')
    }

    chkIsAutoCheckOut?.addEventListener('change', async () => {
        const value = chkIsAutoCheckOut.checked
        await setStorageItem({isAutoCheckOut: value})
    })

    const btnGetToken = document.getElementById('btnGetToken')
    btnGetToken.addEventListener('click', onSave)
})()

async function onSave() {
    // Storage credential information
    const usernameInp = document.getElementById('username')
    const passwordInp = document.getElementById('password')

    const saveItems = {
        username: usernameInp.value,
        password: passwordInp.value,
    }
    console.warn('option: ', saveItems);
    await setStorageItem(saveItems)

    let isSucceeded = false
    try {
        // Refresh token
        await refreshToken()
        isSucceeded = true
    } catch(e) {}

    // Display result status
    const lbProcessStatus = document.getElementById('processStatus')
    lbProcessStatus.innerText = "Get token " + (isSucceeded ? "succeeded" : "fail")
    lbProcessStatus?.classList.toggle(isSucceeded ? 'text-green-300' : 'text-red-300')

    lbProcessStatus.style.display = "block"
}