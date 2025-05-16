async function debridLink(link) {
    try {
        const response = await fetch(`http://localhost:3000/api/debrid?link=${encodeURIComponent(link)}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur serveur');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur fetch:', error);
        throw error;
    }
}

document.getElementById('debridForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const link = document.getElementById('linkInput').value.trim();
    if (!link) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    
    try {
        const data = await debridLink(link);
        
        if (data.status === 'success') {
            document.getElementById('debridedLink').href = data.data.link;
            document.getElementById('debridedLink').textContent = data.data.link;
            document.getElementById('result').classList.remove('d-none');
        } else {
            throw new Error(data.error?.message || 'Échec du débridage');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert(`Erreur: ${error.message}`);
    } finally {
        btn.disabled = false;
    }
});