// frontend/shared/js/auth.js

async function checkAuth(requiredRole) {
    const API = window.API || 'http://localhost:8000'; // ✅ Use from window

    try {
        const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' });

        if (!res.ok) {
            console.log('Not authenticated, redirecting to login...');
            goLogin();
            return null;
        }

        const user = await res.json();
        console.log('✅ User authenticated:', user);

        if (requiredRole && user.role !== requiredRole) {
            console.log('❌ Role mismatch. Expected:', requiredRole, 'Got:', user.role);
            goRole(user.role);
            return null;
        }

        const badge = document.getElementById('userBadge');
        if (badge) {
            badge.textContent = user.name;
            console.log('✅ User badge updated:', user.name);
        }

        return user;

    } catch (error) {
        console.error('❌ Auth check failed:', error);
        goLogin();
        return null;
    }
}

function goLogin() {
    window.location.href = '/login/index.html';
}

function goRole(role) {
    window.location.href = role === 'teacher'
        ? '/teacher/dashboard.html'
        : '/student/dashboard.html';
}

async function logout() {
    const API = window.API || 'http://localhost:8000'; // ✅ Use from window

    try {
        await fetch(`${API}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    goLogin();
}