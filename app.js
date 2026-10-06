(function(){
"use strict";

const $ = id => document.getElementById(id);
const channelList = $('channelList'), nowPlaying = $('nowPlaying'), searchInput = $('searchInput'),
    catTabs = $('catTabs'), reloadBtn = $('reloadBtn'), fullscreenBtn = $('fullscreenBtn'),
    fsBackBtn = $('fsBackBtn'), app = $('app'), pipBtn = $('pipBtn'), randomBtn = $('randomBtn'),
    themeToggle = $('themeToggle'), loadingOverlay = $('loadingOverlay'),
    devBtn = $('devBtn'), profileOverlay = $('profileOverlay'),
    closeProfileBtn = $('closeProfileBtn'), closePopupBtn = $('closePopupBtn'),
    hiddenBtn = $('hiddenBtn'), passwordOverlay = $('passwordOverlay'),
    closePasswordBtn = $('closePasswordBtn'), passwordInput = $('passwordInput'),
    passwordSubmitBtn = $('passwordSubmitBtn'), passwordError = $('passwordError'),
    premiumBtn = $('premiumBtn'), premiumLoginOverlay = $('premiumLoginOverlay'),
    closePremiumLoginBtn = $('closePremiumLoginBtn'), premiumUserInput = $('premiumUserInput'),
    premiumPassInput = $('premiumPassInput'), premiumLoginBtn = $('premiumLoginBtn'),
    premiumLoginError = $('premiumLoginError'), hiddenPlayerOverlay = $('hiddenPlayerOverlay'),
    closeHiddenPlayer = $('closeHiddenPlayer'), hiddenNowPlaying = $('hiddenNowPlaying'),
    hiddenPlayerBadge = $('hiddenPlayerBadge'), helpBtn = $('helpBtn'), helpOverlay = $('helpOverlay'),
    closeHelpBtn = $('closeHelpBtn');

let jwInstance = null, hiddenJwInstance = null;
let allItems = [], activeCategory = 'all', currentUrl = '';
let isFullscreen = false, isMuted = false;
let allChannels = [], hiddenChannels = [], premiumChannels = [];
let hiddenCurrentIndex = 0, isPremiumMode = false;
let CORRECT_PASSWORD = null, PREMIUM_USERS = [];
let searchDebounce = null;

if (localStorage.getItem('sbu_theme') === 'light') document.body.classList.add('light-mode');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('sbu_theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

const openOverlay = el => { el.classList.add('active'); document.body.style.overflow = 'hidden'; };
const closeOverlay = el => { el.classList.remove('active'); document.body.style.overflow = ''; };

devBtn.addEventListener('click', () => openOverlay(profileOverlay));
closeProfileBtn.addEventListener('click', () => closeOverlay(profileOverlay));
closePopupBtn.addEventListener('click', () => closeOverlay(profileOverlay));
profileOverlay.addEventListener('click', e => { if (e.target === profileOverlay) closeOverlay(profileOverlay); });

helpBtn.addEventListener('click', () => openOverlay(helpOverlay));
closeHelpBtn.addEventListener('click', () => closeOverlay(helpOverlay));
helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) closeOverlay(helpOverlay); });

fetch('hidden_password.json').then(r => r.ok ? r.json() : Promise.reject()).then(d => { CORRECT_PASSWORD = d.password || null; }).catch(() => { CORRECT_PASSWORD = null; });
fetch('users.json').then(r => r.ok ? r.json() : Promise.reject()).then(d => { PREMIUM_USERS = d.users || []; }).catch(() => { PREMIUM_USERS = []; });

hiddenBtn.addEventListener('click', () => {
    openOverlay(passwordOverlay);
    passwordInput.value = ''; passwordError.classList.remove('show'); passwordInput.focus();
});
closePasswordBtn.addEventListener('click', () => closeOverlay(passwordOverlay));
passwordOverlay.addEventListener('click', e => { if (e.target === passwordOverlay) closeOverlay(passwordOverlay); });

passwordSubmitBtn.addEventListener('click', () => {
    const entered = passwordInput.value.trim();
    if (!CORRECT_PASSWORD) { passwordError.textContent = '⚠️ hidden_password.json পাওয়া যায়নি!'; passwordError.classList.add('show'); return; }
    if (entered === CORRECT_PASSWORD) {
        closeOverlay(passwordOverlay);
        isPremiumMode = false;
        hiddenPlayerBadge.textContent = '🔒 হিডেন';
        hiddenPlayerBadge.className = 'badge hidden-badge';
        loadHiddenContent();
    } else {
        passwordError.textContent = '❌ ভুল পাসওয়ার্ড!';
        passwordError.classList.add('show');
        passwordInput.value = ''; passwordInput.focus();
    }
});
passwordInput.addEventListener('keydown', e => { if (e.key === 'Enter') passwordSubmitBtn.click(); if (e.key === 'Escape') closeOverlay(passwordOverlay); });

premiumBtn.addEventListener('click', () => {
    openOverlay(premiumLoginOverlay);
    premiumUserInput.value = ''; premiumPassInput.value = '';
    premiumLoginError.classList.remove('show'); premiumUserInput.focus();
});
closePremiumLoginBtn.addEventListener('click', () => closeOverlay(premiumLoginOverlay));
premiumLoginOverlay.addEventListener('click', e => { if (e.target === premiumLoginOverlay) closeOverlay(premiumLoginOverlay); });

premiumLoginBtn.addEventListener('click', () => {
    const u = premiumUserInput.value.trim(), p = premiumPassInput.value.trim();
    const found = PREMIUM_USERS.find(x => x.username === u && x.password === p);
    if (found) {
        closeOverlay(premiumLoginOverlay);
        isPremiumMode = true;
        hiddenPlayerBadge.textContent = '⭐ প্রিমিয়াম';
        hiddenPlayerBadge.className = 'badge premium-badge';
        loadPremiumContent();
    } else {
        premiumLoginError.textContent = '❌ ভুল ইউজারনেম বা পাসওয়ার্ড!';
        premiumLoginError.classList.add('show');
        premiumUserInput.value = ''; premiumPassInput.value = ''; premiumUserInput.focus();
    }
});
premiumUserInput.addEventListener('keydown', e => { if (e.key === 'Enter') premiumPassInput.focus(); });
premiumPassInput.addEventListener('keydown', e => { if (e.key === 'Enter') premiumLoginBtn.click(); });

function loadHiddenContent() {
    fetch('hidden_channels.json').then(r => r.ok ? r.json() : Promise.reject()).then(data => {
        if (!data.channels?.length) { alert('⚠️ হিডেন চ্যানেল পাওয়া যায়নি!'); return; }
        hiddenChannels = data.channels.filter(c => c.status !== 'hidden');
        if (!hiddenChannels.length) { alert('⚠️ কোনো দৃশ্যমান হিডেন চ্যানেল নেই!'); return; }
        openHiddenPlayer(hiddenChannels);
    }).catch(() => alert('⚠️ hidden_channels.json পাওয়া যায়নি!'));
}
function loadPremiumContent() {
    fetch('premium_channels.json').then(r => r.ok ? r.json() : Promise.reject()).then(data => {
        if (!data.channels?.length) { alert('⚠️ প্রিমিয়াম চ্যানেল পাওয়া যায়নি!'); return; }
        premiumChannels = data.channels.filter(c => c.status !== 'hidden');
        if (!premiumChannels.length) { alert('⚠️ কোনো দৃশ্যমান প্রিমিয়াম চ্যানেল নেই!'); return; }
        openHiddenPlayer(premiumChannels);
    }).catch(() => alert('⚠️ premium_channels.json পাওয়া যায়নি!'));
}

function openHiddenPlayer(list) {
    openOverlay(hiddenPlayerOverlay);
    buildHiddenList(list);
    hiddenCurrentIndex = 0;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => playHiddenChannel(0), 150);
        });
    });
}

function playHiddenChannel(index) {
    const list = isPremiumMode ? premiumChannels : hiddenChannels;
    if (!list?.length) return;
    if (index < 0) index = list.length - 1;
    if (index >= list.length) index = 0;
    hiddenCurrentIndex = index;
    const ch = list[index];
    hiddenNowPlaying.textContent = '📡 ' + ch.name;
    document.querySelectorAll('#hiddenChannelList .btn[data-index]').forEach(b => {
        b.classList.toggle('active-btn', parseInt(b.dataset.index) === index);
    });
    if (hiddenJwInstance) {
        hiddenJwInstance.load([{ file: ch.url }]);
        hiddenJwInstance.play();
    } else {
        setupHiddenPlayer(ch);
    }
}
function setupHiddenPlayer(channel) {
    const container = document.querySelector('.hidden-video-wrap');
    const rect = container.getBoundingClientRect();
    let w = Math.floor(rect.width);
    let h = Math.floor(rect.height);
    if (!w || !h) {
        w = Math.min(window.innerWidth - 40, 1400);
        h = Math.round(w * 0.5625);
    }
    console.log('🎬 Setting up hidden player at', w, 'x', h);

    hiddenJwInstance = jwplayer('hiddenPlayer').setup({
        file: channel.url,
        width: w,
        height: h,
        autostart: true, mute: false, primary: 'html5',
        hlsjsConfig: { enableWorker: true, useCues: true, xhrSetup: (xhr) => { xhr.withCredentials = false; } },
        androidhls: true, playbackRateControls: false, bufferLength: 3, preload: 'auto'
    });

    hiddenJwInstance.on('ready', () => {
        setTimeout(() => {
            const r = container.getBoundingClientRect();
            try { hiddenJwInstance.resize(Math.floor(r.width), Math.floor(r.height)); } catch(e){}
        }, 100);
    });
    hiddenJwInstance.on('error', e => {
        console.log('Hidden Player Error:', e.message);
        hiddenNowPlaying.textContent = '⚠️ ' + (e.message || 'স্ট্রিম লোড হয়নি');
    });
    hiddenJwInstance.on('buffer', () => { hiddenNowPlaying.textContent = '⏳ বাফার হচ্ছে...'; });
    hiddenJwInstance.on('play', () => {
        const ch = (isPremiumMode ? premiumChannels : hiddenChannels)[hiddenCurrentIndex];
        hiddenNowPlaying.textContent = '📡 ' + (ch?.name || '');
    });
}

function buildHiddenList(list) {
    const container = $('hiddenChannelList');
    container.innerHTML = '';
    const navWrap = document.createElement('div');
    navWrap.style.cssText = 'display:flex; gap:4px; flex-shrink:0; margin-right:4px;';
    const prevBtn = document.createElement('button'); prevBtn.className = 'nav-btn'; prevBtn.textContent = '⏮';
    prevBtn.addEventListener('click', e => { e.stopPropagation(); playHiddenChannel(hiddenCurrentIndex - 1); });
    const nextBtn = document.createElement('button'); nextBtn.className = 'nav-btn'; nextBtn.textContent = '⏭';
    nextBtn.addEventListener('click', e => { e.stopPropagation(); playHiddenChannel(hiddenCurrentIndex + 1); });
    navWrap.append(prevBtn, nextBtn);
    container.appendChild(navWrap);
    list.forEach((ch, i) => {
        const btn = document.createElement('button');
        btn.className = 'btn'; btn.dataset.index = i; btn.textContent = '🖥️ ' + ch.name;
        btn.addEventListener('click', () => playHiddenChannel(i));
        container.appendChild(btn);
    });
}

closeHiddenPlayer.addEventListener('click', () => {
    closeOverlay(hiddenPlayerOverlay);
    if (hiddenJwInstance) { try { hiddenJwInstance.stop(); hiddenJwInstance.remove(); } catch(e){} hiddenJwInstance = null; }
});

window.addEventListener('resize', () => {
    if (hiddenJwInstance && hiddenPlayerOverlay.classList.contains('active')) {
        const c = document.querySelector('.hidden-video-wrap');
        const r = c.getBoundingClientRect();
        try { hiddenJwInstance.resize(Math.floor(r.width), Math.floor(r.height)); } catch(e){}
    }
    if (jwInstance && !isFullscreen) {
        const c = document.querySelector('.video-wrap');
        try { jwInstance.resize(c.clientWidth, c.clientHeight); } catch(e){}
    }
});
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (hiddenJwInstance && hiddenPlayerOverlay.classList.contains('active')) {
            const c = document.querySelector('.hidden-video-wrap');
            const r = c.getBoundingClientRect();
            try { hiddenJwInstance.resize(Math.floor(r.width), Math.floor(r.height)); } catch(e){}
        }
    }, 300);
});

function showLoading(show) { loadingOverlay.classList.toggle('active', show); }

function setupPlayer(url, cb) {
    currentUrl = url;
    showLoading(true);
    if (jwInstance) {
        jwInstance.load([{ file: url }]);
        jwInstance.play();
        if (cb) cb();
        return;
    }
    jwInstance = jwplayer('player').setup({
        file: url, width: '100%', height: '100%', autostart: true, mute: false,
        primary: 'html5',
        hlsjsConfig: { enableWorker: true, useCues: true, xhrSetup: (xhr) => { xhr.withCredentials = false; } },
        androidhls: true, playbackRateControls: false, bufferLength: 3, preload: 'auto'
    });
    jwInstance.on('play', () => { showLoading(false); if (cb) cb(); });
    jwInstance.on('error', e => {
        showLoading(false);
        nowPlaying.innerHTML = '<span class="live">⚠️</span> ' + e.message;
    });
    jwInstance.on('buffer', () => showLoading(true));
    jwInstance.on('bufferFull', () => showLoading(false));
}

pipBtn.addEventListener('click', async () => {
    if (!jwInstance) return;
    const video = jwInstance.getContainer()?.querySelector('video');
    if (!video) return;
    try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else await video.requestPictureInPicture();
    } catch(e){ console.log('PiP Error:', e); }
});

randomBtn.addEventListener('click', () => {
    const visible = allItems.filter(i => i.style.display !== 'none');
    if (!visible.length) return;
    visible[Math.floor(Math.random() * visible.length)].click();
});

reloadBtn.addEventListener('click', () => {
    if (jwInstance && currentUrl) {
        nowPlaying.innerHTML = '<span class="live">🔄</span> রিলোড...';
        jwInstance.load([{ file: currentUrl }]); jwInstance.play();
    }
});

function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    app.classList.toggle('fullscreen', isFullscreen);
    fullscreenBtn.textContent = isFullscreen ? '✕' : '⛶';
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    if (jwInstance) {
        setTimeout(() => {
            const w = isFullscreen ? window.innerWidth : document.querySelector('.video-wrap').offsetWidth;
            const h = isFullscreen ? window.innerHeight : document.querySelector('.video-wrap').offsetHeight;
            try { jwInstance.resize(w, h); } catch(e){}
        }, 150);
    }
}
fullscreenBtn.addEventListener('click', toggleFullscreen);
fsBackBtn.addEventListener('click', () => { if (isFullscreen) toggleFullscreen(); });

document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ' || e.key === 'Space') { e.preventDefault(); if (jwInstance) jwInstance.playPause(); }
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    if (e.key === 'm' || e.key === 'M') { if (jwInstance) { isMuted = !isMuted; jwInstance.setMute(isMuted); } }
    if (e.key === 'ArrowUp') { if (jwInstance) jwInstance.setVolume(Math.min(jwInstance.getVolume() + 10, 100)); }
    if (e.key === 'ArrowDown') { if (jwInstance) jwInstance.setVolume(Math.max(jwInstance.getVolume() - 10, 0)); }
    if (e.key === 'r' || e.key === 'R') reloadBtn.click();
    if (e.key === 'n' || e.key === 'N') randomBtn.click();
    if (e.key === 'Escape') {
        if (isFullscreen) toggleFullscreen();
        else if (hiddenPlayerOverlay.classList.contains('active')) closeHiddenPlayer.click();
        else if (helpOverlay.classList.contains('active')) closeOverlay(helpOverlay);
        else if (profileOverlay.classList.contains('active')) closeOverlay(profileOverlay);
    }
});

fetch('tv_channels.json').then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(data => {
        if (!data.channels?.length) { channelList.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#666;padding:30px;">কোন চ্যানেল পাওয়া যায়নি</div>'; return; }
        allChannels = data.channels.filter(c => c.status !== 'hidden');
        buildCategoryTabs(allChannels);
        buildList(allChannels);
        if (allItems.length) allItems[0].click();
    })
    .catch(err => {
        console.error(err);
        channelList.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#888;padding:30px;">⚠️ tv_channels.json পাওয়া যায়নি</div>';
    });

function buildCategoryTabs(channels) {
    const cats = {};
    channels.forEach(c => { const k = c.category || 'Other'; cats[k] = (cats[k] || 0) + 1; });
    let html = `<button class="cat-tab active" data-cat="all">সব <span class="count">${channels.length}</span></button>`;
    html += `<button class="cat-tab" data-cat="Favorites">❤️ ফেভ <span class="count">0</span></button>`;
    html += `<button class="cat-tab" data-cat="Recent">🕒 রিসেন্ট <span class="count">0</span></button>`;
    Object.keys(cats).sort().forEach(k => html += `<button class="cat-tab" data-cat="${k}">${k} <span class="count">${cats[k]}</span></button>`);
    catTabs.innerHTML = html;
    document.querySelectorAll('.cat-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            activeCategory = this.dataset.cat;
            filterChannels();
        });
    });
}

function getFavorites() { try { return JSON.parse(localStorage.getItem('sbu_favorites')) || []; } catch(e){ return []; } }
function setFavorites(l) { localStorage.setItem('sbu_favorites', JSON.stringify(l)); }
function toggleFavorite(name) {
    let favs = getFavorites();
    const i = favs.indexOf(name);
    if (i > -1) favs.splice(i, 1); else favs.push(name);
    setFavorites(favs);
    updateFavoriteButtons();
    filterChannels();
    const countEl = document.querySelector('.cat-tab[data-cat="Favorites"] .count');
    if (countEl) countEl.textContent = favs.length;
}
function isFavorite(name) { return getFavorites().includes(name); }
function updateFavoriteButtons() {
    document.querySelectorAll('.channel-item').forEach(el => {
        const b = el.querySelector('.fav-btn');
        if (b) b.classList.toggle('active', isFavorite(el.dataset.name));
    });
}

function getRecent() { try { return JSON.parse(localStorage.getItem('sbu_recent')) || []; } catch(e){ return []; } }
function pushRecent(name) {
    let r = getRecent().filter(x => x !== name);
    r.unshift(name); r = r.slice(0, 20);
    localStorage.setItem('sbu_recent', JSON.stringify(r));
    const countEl = document.querySelector('.cat-tab[data-cat="Recent"] .count');
    if (countEl) countEl.textContent = r.length;
}

function buildList(channels) {
    channelList.innerHTML = '';
    allItems = [];
    channels.forEach(ch => {
        const div = document.createElement('div');
        div.className = 'channel-item';
        div.dataset.name = ch.name.toLowerCase();
        div.dataset.originalName = ch.name;
        div.dataset.category = ch.category || 'Other';
        div.dataset.url = ch.url;
        const fav = isFavorite(ch.name) ? 'active' : '';
        div.innerHTML = `
            <button class="fav-btn ${fav}" data-name="${ch.name}" title="Favorite">🎬</button>
            <div class="ch-icon">📡</div>
            <div class="ch-name">${ch.name}</div>`;
        div.querySelector('.fav-btn').addEventListener('click', e => { e.stopPropagation(); toggleFavorite(ch.name); });
        div.addEventListener('click', function() {
            const url = this.dataset.url;
            if (!url) return;
            document.querySelectorAll('.channel-item').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            nowPlaying.innerHTML = '<span class="live">লাইভ</span> ' + ch.name;
            setupPlayer(url);
            pushRecent(ch.name);
            if (isFullscreen) toggleFullscreen();
        });
        channelList.appendChild(div);
        allItems.push(div);
    });
    filterChannels();
    updateFavoriteButtons();
    const fc = document.querySelector('.cat-tab[data-cat="Favorites"] .count'); if (fc) fc.textContent = getFavorites().length;
    const rc = document.querySelector('.cat-tab[data-cat="Recent"] .count'); if (rc) rc.textContent = getRecent().length;
}

function filterChannels() {
    const q = searchInput.value.toLowerCase().trim();
    const favs = getFavorites(), recent = getRecent();
    allItems.forEach(item => {
        const nameMatch = item.dataset.name.includes(q);
        let catMatch = true;
        if (activeCategory === 'Favorites') catMatch = favs.includes(item.dataset.originalName);
        else if (activeCategory === 'Recent') catMatch = recent.includes(item.dataset.originalName);
        else if (activeCategory !== 'all') catMatch = item.dataset.category === activeCategory;
        item.style.display = (nameMatch && catMatch) ? '' : 'none';
    });
}
searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(filterChannels, 250);
});

const shareGroup = document.createElement('div');
shareGroup.style.cssText = 'display:flex; gap:4px;';
shareGroup.innerHTML = `
    <button class="btn" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href),'_blank')">📘 FB</button>
    <button class="btn" onclick="window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(window.location.href),'_blank')">💬 WA</button>`;
document.querySelector('.controls-group').appendChild(shareGroup);

setTimeout(() => {
    if (jwInstance) {
        const c = document.querySelector('.video-wrap');
        try { jwInstance.resize(c.offsetWidth, c.offsetHeight); } catch(e){}
    }
}, 1500);

console.log('%c✦ SBU TV Player Pro loaded ✦', 'color:#ffd700; font-weight:bold; font-size:14px;');
})();