require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/api/debrid', async (req, res) => {
    try {
        const { link } = req.query;
        if (!link) throw new Error('Paramètre "link" manquant');

        const response = await axios.get('https://api.alldebrid.com/v4/link/unlock', {
            params: {
                agent: 'DebrideurApp',
                apikey: process.env.ALLDEBRID_API_KEY,
                link: link
            },
            timeout: 10000
        });

        res.json(response.data);
    } catch (error) {
        console.error('Erreur:', {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });
        res.status(500).json({
            error: error.response?.data?.error?.message || error.message
        });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log(`\n=== Serveur prêt ===`);
    console.log(`Clé API: ${process.env.ALLDEBRID_API_KEY ? 'Configurée' : 'MANQUANTE'}`);
    console.log(`Test frontend: http://localhost:3000`);
    console.log(`Test API: curl "http://localhost:3000/api/debrid?link=https://1fichier.com/?abc123"\n`);
});