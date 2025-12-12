let rounds = [];
let clubStats = [];

const clubTypes = [
    'Driver', '3 Wood', 'Hybrid', '6 Iron', '7 Iron', 
    '8 Iron', '9 Iron', 'Pitching Wedge', 'Sand Wedge'
];

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    showPage('home');
});

async function loadData() {
    try {
        const roundsResult = await window.storage.get('golf-rounds');
        const clubsResult = await window.storage.get('golf-clubs');
        
        if (roundsResult) {
            rounds = JSON.parse(roundsResult.value);
        }
        if (clubsResult) {
            clubStats = JSON.parse(clubsResult.value);
        }
        
        updateAllDisplays();
    } catch (error) {
        console.log('No existing data found, starting fresh');
    }
}

async function saveRounds() {
    try {
        await window.storage.set('golf-rounds', JSON.stringify(rounds));
    } catch (error) {
        console.error('Error saving rounds:', error);
    }
}

async function saveClubStats() {
    try {
        await window.storage.set('golf-clubs', JSON.stringify(clubStats));
    } catch (error) {
        console.error('Error saving club stats:', error);
    }
}

function setupEventListeners() {
    document.getElementById('header-brand').addEventListener('click', () => showPage('home'));
    document.getElementById('nav-add').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('add');
    });
    document.getElementById('nav-history').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('history');
    });
    document.getElementById('nav-stats').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('stats');
    });

    document.getElementById('show-round-form').addEventListener('click', () => {
        document.getElementById('round-form').classList.remove('hidden');
        document.getElementById('show-round-form').classList.add('hidden');
    });
    
    document.getElementById('cancel-round').addEventListener('click', () => {
        document.getElementById('round-form').classList.add('hidden');
        document.getElementById('show-round-form').classList.remove('hidden');
        document.getElementById('round-form').reset();
    });

    document.getElementById('round-form').addEventListener('submit', handleAddRound);

    document.getElementById('show-club-form').addEventListener('click', () => {
        document.getElementById('club-form').classList.remove('hidden');
        document.getElementById('show-club-form').classList.add('hidden');
    });
    
    document.getElementById('cancel-club').addEventListener('click', () => {
        document.getElementById('club-form').classList.add('hidden');
        document.getElementById('show-club-form').classList.remove('hidden');
        document.getElementById('club-form').reset();
    });

    document.getElementById('club-form').addEventListener('submit', handleAddClubStat);
}

function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        if (pageName === 'history') {
            displayRoundsHistory();
            displayClubsHistory();
        } else if (pageName === 'stats') {
            displayStats();
        }
    }
}

async function handleAddRound(e) {
    e.preventDefault();
    
    const course = document.getElementById('course-name').value;
    const holes = parseInt(document.getElementById('holes').value);
    const score = parseInt(document.getElementById('score').value);
    const date = document.getElementById('date').value;

    if (course && score && date) {
        const par = holes === 18 ? 72 : 36;
        const newRound = {
            id: Date.now(),
            course: course,
            holes: holes,
            score: score,
            date: date,
            scoreRelativeToPar: score - par
        };
        
        rounds.push(newRound);
        await saveRounds();
        
        document.getElementById('round-form').reset();
        document.getElementById('round-form').classList.add('hidden');
        document.getElementById('show-round-form').classList.remove('hidden');
    }
}

async function handleAddClubStat(e) {
    e.preventDefault();
    
    const club = document.getElementById('club-type').value;
    const distance = parseInt(document.getElementById('distance').value);
    const date = document.getElementById('club-date').value;

    if (club && distance && date) {
        const newStat = {
            id: Date.now(),
            club: club,
            distance: distance,
            date: date
        };
        
        clubStats.push(newStat);
        await saveClubStats();
        
        document.getElementById('club-form').reset();
        document.getElementById('club-form').classList.add('hidden');
        document.getElementById('show-club-form').classList.remove('hidden');
    }
}

async function deleteRound(id) {
    if (confirm('Are you sure you want to delete this round?')) {
        rounds = rounds.filter(round => round.id !== id);
        await saveRounds();
        displayRoundsHistory();
        displayStats();
    }
}

async function deleteClubStat(id) {
    if (confirm('Are you sure you want to delete this club distance?')) {
        clubStats = clubStats.filter(stat => stat.id !== id);
        await saveClubStats();
        displayClubsHistory();
        displayStats();
    }
}

function displayRoundsHistory() {
    const container = document.getElementById('rounds-list');
    
    if (rounds.length === 0) {
        container.innerHTML = '<p class="empty-message">No rounds recorded yet. Start by adding a round!</p>';
        return;
    }
    
    const sortedRounds = [...rounds].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedRounds.map(round => `
        <div class="history-item">
            <div class="history-item-content">
                <h3>${round.course}</h3>
                <p>${round.holes} holes • Score: ${round.score} (${round.scoreRelativeToPar > 0 ? '+' : ''}${round.scoreRelativeToPar})</p>
                <p style="color: #999; font-size: 0.9rem;">${formatDate(round.date)}</p>
            </div>
            <button class="btn-delete" onclick="deleteRound(${round.id})">Delete</button>
        </div>
    `).join('');
}

function displayClubsHistory() {
    const container = document.getElementById('clubs-list');
    
    if (clubStats.length === 0) {
        container.innerHTML = '<p class="empty-message">No club distances recorded yet.</p>';
        return;
    }
    
    const sortedStats = [...clubStats].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedStats.map(stat => `
        <div class="history-item">
            <div class="history-item-content">
                <h3>${stat.club}</h3>
                <p>Distance: ${stat.distance} yards</p>
                <p style="color: #999; font-size: 0.9rem;">${formatDate(stat.date)}</p>
            </div>
            <button class="btn-delete" onclick="deleteClubStat(${stat.id})">Delete</button>
        </div>
    `).join('');
}

function displayStats() {
    displayBestRounds();
    displayClubStats();
}

function displayBestRounds() {
    const best18Container = document.getElementById('best-18');
    const best9Container = document.getElementById('best-9');
    
    const best18 = getBestRound(18);
    const best9 = getBestRound(9);
    
    if (best18) {
        best18Container.innerHTML = `
            <p><strong>Strokes:</strong> ${best18.score}</p>
            <p><strong>Score:</strong> ${best18.scoreRelativeToPar > 0 ? '+' : ''}${best18.scoreRelativeToPar}</p>
            <p><strong>Course:</strong> ${best18.course}</p>
            <p><strong>Date:</strong> ${formatDate(best18.date)}</p>
        `;
    } else {
        best18Container.innerHTML = '<p class="no-data">No 18-hole rounds recorded</p>';
    }
    
    if (best9) {
        best9Container.innerHTML = `
            <p><strong>Strokes:</strong> ${best9.score}</p>
            <p><strong>Score:</strong> ${best9.scoreRelativeToPar > 0 ? '+' : ''}${best9.scoreRelativeToPar}</p>
            <p><strong>Course:</strong> ${best9.course}</p>
            <p><strong>Date:</strong> ${formatDate(best9.date)}</p>
        `;
    } else {
        best9Container.innerHTML = '<p class="no-data">No 9-hole rounds recorded</p>';
    }
}

function displayClubStats() {
    const container = document.getElementById('club-stats');
    
    container.innerHTML = clubTypes.map(clubName => {
        const best = getClubBest(clubName);
        return `
            <div class="club-stat-card">
                <h3>${clubName}:</h3>
                ${best 
                    ? `<p>Best: <strong>${best.distance} yards</strong></p>` 
                    : '<p class="no-data">No data</p>'
                }
            </div>
        `;
    }).join('');
}

function getBestRound(holes) {
    const filtered = rounds.filter(r => r.holes === holes);
    if (filtered.length === 0) return null;
    
    return filtered.reduce((best, current) => 
        current.score < best.score ? current : best
    );
}

function getClubBest(clubName) {
    const filtered = clubStats.filter(s => s.club === clubName);
    if (filtered.length === 0) return null;
    
    return filtered.reduce((best, current) => 
        current.distance > best.distance ? current : best
    );
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function updateAllDisplays() {
    displayRoundsHistory();
    displayClubsHistory();
    displayStats();
}