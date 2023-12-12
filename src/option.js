import ChromeHelper from "./helpers/ChromeHelper";

(async function () {
    const chromeHelper = new ChromeHelper(chrome)

    // User name
    const usernameInp = document.getElementById('username')
    const username = await chromeHelper.getStorageItem('username') ?? ''
    usernameInp.value = username

    // Password
    const passwordInp = document.getElementById('password')
    let password = await chromeHelper.getStorageItem('password') ?? ''
    passwordInp.value = password

    // isAutoCheckIn
    const chkIsAutoCheckIn = document.getElementById('isAutoCheckIn')
    let isAutoCheckIn = await chromeHelper.getStorageItem('isAutoCheckIn') ?? false
    if (isAutoCheckIn) {
        chkIsAutoCheckIn?.setAttribute('checked', 'checked')
    }

    // isAutoCheckOut
    const chkIsAutoCheckOut = document.getElementById('isAutoCheckOut')
    let isAutoCheckOut = await chromeHelper.getStorageItem('isAutoCheckOut') ?? false
    if (isAutoCheckOut) {
        chkIsAutoCheckOut?.setAttribute('checked', 'checked')
    }

    // Add event listeners
    usernameInp?.addEventListener('change', async (e) => {
        await chromeHelper.setStorageItem({ username: usernameInp.value })
    })

    passwordInp?.addEventListener('change', async (e) => {
        await chromeHelper.setStorageItem({ password: passwordInp.value })
    })

    chkIsAutoCheckIn?.addEventListener('change', async () => {
        const value = chkIsAutoCheckIn.checked
        await chromeHelper.setStorageItem({ isAutoCheckIn: value })
    })

    chkIsAutoCheckOut?.addEventListener('change', async () => {
        const value = chkIsAutoCheckOut.checked
        await chromeHelper.setStorageItem({ isAutoCheckOut: value })
    })
})()