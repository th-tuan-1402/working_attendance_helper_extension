export function env(key: string): string {
    let refinedKey = "VITE_" + key
    
    return import.meta.env[refinedKey]
}