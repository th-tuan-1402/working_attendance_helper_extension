import { getStorageItem, setStorageItem } from "./static/ChromeApiHelper";
import { login, loginKintai } from "./static/hitoCommonApi";

(async function () {
    console.warn("option page loaded");

    let username = await getStorageItem('username')
    const usernameInp = document.getElementById('username')
    usernameInp.value = username

    let password = await getStorageItem('password')
    const passwordInp = document.getElementById('password')
    passwordInp.value = password

    const btnSave = document.getElementById('btnSave')
    btnSave.addEventListener('click', onSave)
})()
 
async function onSave() {
    // Storage credential information
    const usernameInp = document.getElementById('username')
    const passwordInp = document.getElementById('password')

    console.warn("save credential: ", "user: ", usernameInp.value, "password: ", passwordInp.value);

    const saveItems = {
        username: usernameInp.value,
        password: passwordInp.value
    }

    await setStorageItem(saveItems)

    // Relogin
    await login()
    await loginKintai()

    const lbProcessStatus = document.getElementById('processStatus')

    lbProcessStatus.innerText = "Saved"
    lbProcessStatus.style.display = "block"
}