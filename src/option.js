import { getStorageItem, setStorageItem } from "./ChromeApiHelper";
import { login, loginKintai } from "./hitoCommonApi";

(async function () {

    let username = await getStorageItem('username')
    const usernameInp = document.getElementById('username')
    usernameInp.value = username

    let password = await getStorageItem('password')
    const passwordInp = document.getElementById('password')
    passwordInp.value = password

    const btnSave = document.getElementById('btnSave')
    btnSave.addEventListener('click', onSave)

    const chkIsAutoCheckIn = document.getElementById('isAutoCheckIn')
    chkIsAutoCheckIn?.addEventListener('change', async () => {
        const value = chkIsAutoCheckIn.checked
        await setStorageItem({isAutoCheckIn: value})
    })

    const chkIsAutoCheckOut = document.getElementById('isAutoCheckOut')
    chkIsAutoCheckOut?.addEventListener('change', async () => {
        const value = chkIsAutoCheckOut.checked
        await setStorageItem({isAutoCheckOut: value})
    })
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

    // Relogin
    await login()
    await loginKintai()

    const lbProcessStatus = document.getElementById('processStatus')

    lbProcessStatus.innerText = "Saved"
    lbProcessStatus.style.display = "block"
}