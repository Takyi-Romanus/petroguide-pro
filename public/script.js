 // Update navbar for logged-in user
    fetch('/api/me', { credentials: 'include' }).then(r => r.json()).then(data => {
      if (data.user) {
        document.getElementById('navActions').innerHTML = `
          <a href="/dashboard" class="btn btn-outline">Dashboard</a>
          <button onclick="logout()" class="btn btn-primary">Log Out</button>
        `;
      }
    });

    // Load live stats
    fetch('/api/stats', { credentials: 'include' }).then(r => r.json()).then(data => {
      if (data.success) {
        document.getElementById('statUsers').textContent = data.data.users.toLocaleString();
        document.getElementById('statModules').textContent = data.data.modules;
        document.getElementById('statHazards').textContent = data.data.hazards;
        document.getElementById('statCareers').textContent = data.data.careers;
      }
    });

    async function logout() {
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
      window.location.href = '/';
    }