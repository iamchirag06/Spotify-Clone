console.log('Spotify Clone - Working Version with Cover Images');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// ============= SONG DATABASE - ADD YOUR SONGS HERE =============
// This is where you can add more songs to any folder
const SONG_DATABASE = {
    "songs/ncs": [
        "Song1.mp3",
        "Song2.mp3",
        // Add more NCS songs here in the same format
        // Example: "Song3.mp3",
    ],
    "songs/pop": [
        "Aaj Ki Raat - Stree 2.mp3",
        // Add more pop songs here in the same format
        // Example: "PopSong2.mp3",
    ],
    // You can add a new folder here by adding a new key-value pair
    "songs/bollywood": [
        // "BollywoodSong1.mp3",
        // "Song2.mp3",
        "Laal Pari - Housefull 5.mp3",
    ],
    "songs/rap": [
        "RapSong1.mp3",
        "RapSong2.mp3",
    ]
};

// ============= ALBUM DATABASE - ADD YOUR ALBUMS HERE =============
const ALBUM_DATABASE = [
    {
        folder: "songs/ncs",
        title: "NoCopyrightSounds",
        description: "Free copyright music",
        cover: "img/copyright.png" // Use a default image if you don't have a cover
    },
    {
        folder: "songs/pop",
        title: "Popular Hits",
        description: "Top chart music",
        cover: "img/popular.png" // Use a default image if you don't have a cover
    },
    // Add new albums for the new folders
    {
        folder: "songs/bollywood",
        title: "Bollywood Hits",
        description: "Hindi movie songs",
        cover: "img/bollywood.png" // Use a default image if you don't have a cover
    },
    {
        folder: "songs/rap",
        title: "Rap & Hip Hop",
        description: "Best rap collection",
        cover: "img/hiphop.png" // Use a default image if you don't have a cover
    }
];
// ================================================================

// Function to get album cover for a specific folder
function getAlbumCover(folder) {
    const album = ALBUM_DATABASE.find(album => album.folder === folder);
    return album ? album.cover : "img/music.svg";
}

// Function to create a now playing container
function createNowPlayingView() {
    // Create the now playing container if it doesn't exist
    if (!document.querySelector('.now-playing-container')) {
        const container = document.createElement('div');
        container.className = 'now-playing-container';
        container.style.cssText = `
            display: flex;
            align-items: center;
            padding: 10px;
            margin-bottom: 10px;
            background-color: rgba(40, 40, 40, 0.8);
            border-radius: 10px;
            position: relative;
        `;
        
        container.innerHTML = `
            <div class="now-playing-cover" style="margin-right: 15px;">
                <img src="img/music.svg" alt="Now Playing" width="60" height="60" style="border-radius: 5px; object-fit: cover;">
            </div>
            <div class="now-playing-info" style="flex-grow: 1;">
                <div class="now-playing-title" style="font-weight: bold; margin-bottom: 5px;">No song selected</div>
                <div class="now-playing-album" style="font-size: 0.9em; opacity: 0.8;">Not playing</div>
            </div>
        `;
        
        // Insert before the playbar
        const playbar = document.querySelector('.playbar');
        playbar.parentNode.insertBefore(container, playbar);
    }
}

// Function to update now playing view
function updateNowPlayingView(track, folder) {
    const container = document.querySelector('.now-playing-container');
    if (!container) return;
    
    const albumCover = getAlbumCover(folder);
    const albumTitle = ALBUM_DATABASE.find(album => album.folder === folder)?.title || "Unknown Album";
    
    // Update the cover image
    container.querySelector('.now-playing-cover img').src = albumCover;
    
    // Update the song title and album name
    container.querySelector('.now-playing-title').textContent = track.replace(".mp3", "");
    container.querySelector('.now-playing-album').textContent = albumTitle;
}

// Function to fetch songs from a folder
async function getSongs(folder) {
    currFolder = folder;
    
    // Get songs from the database
    songs = SONG_DATABASE[folder] || [];

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    
    const albumCover = getAlbumCover(folder);
    
    for (const song of songs) {
        songUL.innerHTML += `<li data-cover="${albumCover}"><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt=""/>
                            </div></li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", element => {
            playMusic(songs[index]);
        });
    });

    return songs;
}

// Function to play music
const playMusic = (track, pause = false) => {
    // Set the source to the actual path based on current folder
    currentSong.src = `${currFolder}/${track}`;
    
    if (!pause) {
        currentSong.play()
            .catch(e => {
                console.error("Error playing audio:", e);
                alert(`Error playing ${track}. Make sure the file exists in the ${currFolder} folder.`);
            });
        play.src = "img/pause.svg";
    }
    
    // Update song info display
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    
    // Update the now playing view with cover image
    updateNowPlayingView(track, currFolder);
}

// Function to display albums
function displayAlbums() {
    console.log("Displaying albums");
    
    // Get the container for album cards
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";
    
    // Display all albums from database
    for (const album of ALBUM_DATABASE) {
        cardContainer.innerHTML += `<div data-folder="${album.folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <img src="${album.cover}" alt="${album.title}"/>
            <h2>${album.title}</h2>
            <p>${album.description}</p>
        </div>`;
    }
    
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            let folder = item.currentTarget.dataset.folder;
            console.log("Fetching Songs for", folder);
            songs = await getSongs(folder);
            if (songs.length > 0) {
                playMusic(songs[0]);
            } else {
                alert(`No songs found in ${folder}`);
            }
        });
    });
}

async function main() {
    // Create the now playing view
    createNowPlayingView();
    
    // Initialize with the NCS playlist
    await getSongs("songs/ncs");
    playMusic(songs[0], true);
    
    // Display albums
    displayAlbums();

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
                .catch(e => console.error("Error playing audio:", e));
            play.src = "img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%";
    });

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        if (!currentSong.src) return;
        
        currentSong.pause();
        console.log("Previous clicked");
        
        const currentTrack = currentSong.src.split("/").pop();
        let index = songs.indexOf(currentTrack);
        if (index === -1) {
            // If not found by exact name, try a more flexible approach
            index = songs.findIndex(song => currentTrack.includes(song));
        }
        
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        } else {
            // Play the last song (loop to the end)
            playMusic(songs[songs.length - 1]);
        }
    });

    // Add an event listener to next
    next.addEventListener("click", () => {
        if (!currentSong.src) return;
        
        currentSong.pause();
        console.log("Next clicked");
        
        const currentTrack = currentSong.src.split("/").pop();
        let index = songs.indexOf(currentTrack);
        if (index === -1) {
            // If not found by exact name, try a more flexible approach
            index = songs.findIndex(song => currentTrack.includes(song));
        }
        
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            // Loop back to the first song
            playMusic(songs[0]);
        }
    });

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => { 
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });
    
    // Add event listener for song end
    currentSong.addEventListener("ended", () => {
        // Auto play next song
        const currentTrack = currentSong.src.split("/").pop();
        let index = songs.indexOf(currentTrack);
        if (index === -1) {
            // If not found by exact name, try a more flexible approach
            index = songs.findIndex(song => currentTrack.includes(song));
        }
        
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            // Loop back to beginning or stop
            play.src = "img/play.svg";
        }
    });
}

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", main);