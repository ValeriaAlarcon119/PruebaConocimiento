const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = 'c7da69c9651075b9afc262f3671486a5';
const BASE_URL = 'https://api.themoviedb.org/3';

async function seed() {
    console.log('Generando datos profesionales para CineFlow desde TMDb...');

    try {
        // 1. Obtener Categorías (Géneros)
        const genreRes = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
        const generos = genreRes.data.genres.map(g => ({ id: g.id, nombre: g.name }));

        // 2. Países de prueba
        const paises = [
            { id: 1, nombre: 'Estados Unidos' },
            { id: 2, nombre: 'España' },
            { id: 3, nombre: 'Colombia' },
            { id: 4, nombre: 'Reino Unido' },
            { id: 5, nombre: 'Corea del Sur' }
        ];

        // 3. Obtener Películas Populares
        const movieRes = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
        const rawMovies = movieRes.data.results.slice(0, 20);

        const peliculas = [];
        const directores = [];
        const actores = [];

        for (let i = 0; i < rawMovies.length; i++) {
            const m = rawMovies[i];
            
            // Obtener créditos (Director y Actores)
            const creditsRes = await axios.get(`${BASE_URL}/movie/${m.id}/credits?api_key=${API_KEY}`);
            const directorData = creditsRes.data.crew.find(c => c.job === 'Director');
            const castData = creditsRes.data.cast.slice(0, 5);

            let directorId = 1;
            if (directorData) {
                directorId = directores.length + 1;
                directores.push({
                    id: directorId,
                    nombre: directorData.name,
                    paisId: Math.floor(Math.random() * 5) + 1
                });
            }

            const movieActoresIds = [];
            castData.forEach(actor => {
                let actorObj = actores.find(a => a.nombre === actor.name);
                if (!actorObj) {
                    const newId = actores.length + 1;
                    actorObj = { id: newId, nombre: actor.name };
                    actores.push(actorObj);
                }
                movieActoresIds.push(actorObj.id);
            });

            // Obtener video (Tráiler)
            const videoRes = await axios.get(`${BASE_URL}/movie/${m.id}/videos?api_key=${API_KEY}`);
            const trailer = videoRes.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key || 'dQw4w9WgXcQ';

            peliculas.push({
                id: i + 1,
                titulo: m.title,
                resena: m.overview || 'Sin reseña disponible.',
                portada: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                trailer: trailer,
                directorId: directorId,
                generoId: m.genre_ids[0] || generos[0].id,
                actoresIds: movieActoresIds
            });
        }

        const db = {
            peliculas,
            directores,
            actores,
            generos,
            paises
        };

        fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));
        console.log('¡Hecho! Tu archivo db.json ahora tiene contenido real de TMDb.');

    } catch (error) {
        console.error('Error al generar la semilla:', error.message);
    }
}

seed();