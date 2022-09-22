const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
const headerEl = document.getElementsByTagName('header');

let searchTerm;
let pageNumber = 1;

//fetch searched song or artist data from API
function searchSongs() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8a3ae32fdamsh3f69042bdb0c81ap103d85jsnb58c0de7942e',
            'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    fetch(`https://genius-song-lyrics1.p.rapidapi.com/search?q=${searchTerm}&per_page=20&page=${pageNumber}`, options)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            showData(data);
        });
}

//show songs and it's artist in DOM
function showData(data) {
    let output = '';

    data.response.hits.forEach(song => {
        output += `
            <li>
                <span><strong>${song.result.artist_names}</strong> - ${song.result.title}</span>
                <button class="btn" data-song_id="${song.result.id}" data-artist="${song.result.artist_names}" data-song_title="${song.result.title}">Get Lyrics</button>
            </li>
        `;
    });

    result.innerHTML = `
        <ul class="songs">
            ${output}
        </ul>
    `;

    if (pageNumber === 1) {
        more.innerHTML = `<button class="btn" id="next-btn">Next</button>`;
    }
    else {
        more.innerHTML = `
            <button class="btn" id="prev-btn">Previous</button>
            <button class="btn" id="next-btn">Next</button>
        `;
    }
}

//fetch and display lyrics in DOM
function displayLyrics(songID, artist, songTitle) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8a3ae32fdamsh3f69042bdb0c81ap103d85jsnb58c0de7942e',
            'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    fetch(`https://genius-song-lyrics1.p.rapidapi.com/songs/${songID}/lyrics`, options)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            const lyrics = data.response.lyrics.lyrics.body.html;

            result.innerHTML = `
                <h2><strong>${artist}</strong> - ${songTitle}</h2>
                <span>${lyrics}</span>
            `;
        });

    more.innerHTML = '';
}

//Event Listeners
form.addEventListener('submit', e => {
    e.preventDefault();

    searchTerm = search.value.trim();

    search.value = '';

    if (!searchTerm) {
        alert('Please type in a search term');
    }
    else {
        searchSongs();
    }
});

//next and previous button click
document.body.addEventListener('click', e => {
    if (e.target.id == 'next-btn') {
        pageNumber++;
        searchSongs();
    }
    else if (e.target.id == 'prev-btn') {
        pageNumber--;
        searchSongs();
    }
});

//get lyrics button click
result.addEventListener('click', e => {
    if (e.target.tagName == 'BUTTON') {
        const songID = e.target.getAttribute('data-song_id');
        const artist = e.target.getAttribute('data-artist');
        const songTitle = e.target.getAttribute('data-song_title');

        displayLyrics(songID, artist, songTitle);
    }
});