export async function login(username, password) {
    return await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
}

export async function register(username, password) {
    return await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
}

export async function fetchProfile(token) {
    return await fetch('/api/profile', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    });
}
