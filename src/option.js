import { getStorageItem, setStorageItem } from "./ChromeApiHelper";

(async function () {
    // Init display

    // User name
    const usernameInp = document.getElementById('username')
    const username = await getStorageItem('username') ?? ''
    usernameInp.value = username

    // Password
    const passwordInp = document.getElementById('password')
    let password = await getStorageItem('password') ?? ''
    passwordInp.value = password

    // isAutoCheckIn
    const chkIsAutoCheckIn = document.getElementById('isAutoCheckIn')
    let isAutoCheckIn = await getStorageItem('isAutoCheckIn') ?? false
    if (isAutoCheckIn) {
        chkIsAutoCheckIn?.setAttribute('checked', 'checked')
    }

    // isAutoCheckOut
    const chkIsAutoCheckOut = document.getElementById('isAutoCheckOut')
    let isAutoCheckOut = await getStorageItem('isAutoCheckOut') ?? false
    if (isAutoCheckOut) {
        chkIsAutoCheckOut?.setAttribute('checked', 'checked')
    }

    // Add event listeners
    usernameInp?.addEventListener('change', async (e) => {
        await setStorageItem({username: usernameInp.value})
    })

    passwordInp?.addEventListener('change', async (e) => {
        await setStorageItem({password: passwordInp.value})
    })

    chkIsAutoCheckIn?.addEventListener('change', async () => {
        const value = chkIsAutoCheckIn.checked
        await setStorageItem({isAutoCheckIn: value})
    })

    chkIsAutoCheckOut?.addEventListener('change', async () => {
        const value = chkIsAutoCheckOut.checked
        await setStorageItem({isAutoCheckOut: value})
    })
})()