(function(){
"use strict";

/* ==================== DATA URLs ==================== */
const USE_LOCAL_JSON = true;
const URLS = USE_LOCAL_JSON ? {
    tv:       'http://198.195.239.50/tv_channels.json',
    hidden:   'hidden_channels.json',
    premium:  'premium_channels.json',
    password: 'hidden_password.json',
    users:    'users.json'
} : {
    tv:       'https://cdn.jsdelivr.net/gh/yourusername/sbu-tv-data@main/tv_channels.json',
    hidden:   'https://cdn.jsdelivr.net/gh/yourusername/sbu-tv-data@main/hidden_channels.json',
    premium:  'https://cdn.jsdelivr.net/gh/yourusername/sbu-tv-data@main/premium_channels.json',
    password: 'https://cdn.jsdelivr.net/gh/yourusername/sbu-tv-data@main/hidden_password.json',
    users:    'https://cdn.jsdelivr.net/gh/yourusername/sbu-tv-data@main/users.json'
};

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

const qualityBtn = $('qualityBtn'), qualityOverlay = $('qualityOverlay'),
    closeQualityBtn = $('closeQualityBtn'), qualityList = $('qualityList'),
    availableLevelsEl = $('availableLevels'), currentLevelEl = $('currentLevel');

const themeOverlay = $('themeOverlay'), closeThemeBtn = $('closeThemeBtn'),
    themeGrid = $('themeGrid');

let jwInstance = null, hiddenJwInstance = null;
let allItems = [], activeCategory = 'all', currentUrl = '';
let isFullscreen = false, isMuted = false;
let allChannels = [], hiddenChannels = [], premiumChannels = [];
let hiddenCurrentIndex = 0, isPremiumMode = false;
let CORRECT_PASSWORD = null, PREMIUM_USERS = [];
let searchDebounce = null;
let preferredQuality = localStorage.getItem('sbu_quality') || 'auto';
let currentTheme = localStorage.getItem('sbu_theme') || 'dark';

/* ==================== 🎨 THEME SYSTEM ==================== */
const THEMES = ['dark', 'light', 'pink', 'blue', 'green', 'peach', 'sunflower', 'lavender'];

function applyTheme(themeName) {
    // সব theme ক্লাস মুছে দাও
    THEMES.forEach(t => document.body.classList.remove('theme-' + t));
    
    // Dark theme ডিফল্ট — কোনো ক্লাস লাগে না
    if (themeName !== 'dark') {
        document.body.classList.add('theme-' + themeName);
    }
    
    // Theme toggle button emoji update
    const emojis = {
        dark: '🌙', light: '☀️', pink: '🌸', blue: '💙',
        green: '💚', peach: '🍑', sunflower: '🌻', lavender: '💜'
    };
    if (themeToggle) themeToggle.textContent = emojis[themeName] || '🎨';
    
    // Update active option in theme grid
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === themeName);
    });
    
    // Save theme
    currentTheme = themeName;
    localStorage.setItem('sbu_theme', themeName);
    
    // Update theme-color meta
    const themeColors = {
        dark: '#0a0a12', light: '#fef6f0', pink: '#fff0f6', blue: '#eff8ff',
        green: '#f0fdf4', peach: '#fff5eb', sunflower: '#fefce8', lavender: '#f5f3ff'
    };
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = themeColors[themeName] || '#0a0a12';
    
    console.log('🎨 Theme applied:', themeName);
}

function openThemeModal() {
    if (!themeOverlay) return;
    themeOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeThemeModal() {
    if (!themeOverlay) return;
    themeOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (themeToggle) themeToggle.addEventListener('click', openThemeModal);
if (closeThemeBtn) closeThemeBtn.addEventListener('click', closeThemeModal);
if (themeOverlay) themeOverlay.addEventListener('click', e => {
    if (e.target === themeOverlay) closeThemeModal();
});

if (themeGrid) {
    themeGrid.addEventListener('click', e => {
        const option = e.target.closest('.theme-option');
        if (!option) return;
        const theme = option.dataset.theme;
        applyTheme(theme);
        showThemeToast(theme);
        setTimeout(closeThemeModal, 400);
    });
}

function showThemeToast(themeName) {
    const names = {
        dark: '🌙 Dark Theme', light: '☀️ Light Theme', pink: '🌸 Pink Theme',
        blue: '💙 Sky Blue Theme', green: '💚 Mint Theme', peach: '🍑 Peach Theme',
        sunflower: '🌻 Sunflower Theme', lavender: '💜 Lavender Theme'
    };
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: var(--gradient-premium); color: #fff; padding: 12px 24px;
        border-radius: 50px; font-weight: 700; font-size: 0.85rem;
        z-index: 99999; box-shadow: 0 8px 40px rgba(255, 215, 0, 0.4);
        animation: fadeInUp 0.3s ease; pointer-events: none; white-space: nowrap;
    `;
    toast.textContent = names[themeName] || 'থিম পরিবর্তিত';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s';
        setTimeout(() => toast.remove(), 400);
    }, 1500);
}

// ✅ প্রাথমিকভাবে থিম apply করো
applyTheme(currentTheme);

/* ==================== OVERLAY HELPERS ==================== */
const openOverlay = el => { if (!el) return; el.classList.add('active'); document.body.style.overflow = 'hidden'; };
const closeOverlay = el => { if (!el) return; el.classList.remove('active'); document.body.style.overflow = ''; };

/* ==================== DEVELOPER PROFILE ==================== */
devBtn.addEventListener('click', () => openOverlay(profileOverlay));
closeProfileBtn.addEventListener('click', () => closeOverlay(profileOverlay));
closePopupBtn.addEventListener('click', () => closeOverlay(profileOverlay));
profileOverlay.addEventListener('click', e => { if (e.target === profileOverlay) closeOverlay(profileOverlay); });

/* ==================== HELP ==================== */
helpBtn.addEventListener('click', () => openOverlay(helpOverlay));
closeHelpBtn.addEventListener('click', () => closeOverlay(helpOverlay));
helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) closeOverlay(helpOverlay); });

/* ==================== LOAD CONFIG JSON ==================== */
fetch(URLS.password).then(r => r.ok ? r.json() : Promise.reject()).then(d => { CORRECT_PASSWORD = d.password || null; }).catch(() => { CORRECT_PASSWORD = null; });
fetch(URLS.users).then(r => r.ok ? r.json() : Promise.reject()).then(d => { PREMIUM_USERS = d.users || []; }).catch(() => { PREMIUM_USERS = []; });

/* ==================== HIDDEN PASSWORD ==================== */
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

/* ==================== PREMIUM LOGIN ==================== */
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

/* ==================== LOAD HIDDEN / PREMIUM ==================== */
function loadHiddenContent() {
    fetch(URLS.hidden).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
        if (!data.channels?.length) { alert('⚠️ হিডেন চ্যানেল পাওয়া যায়নি!'); return; }
        hiddenChannels = data.channels.filter(c => c.status !== 'hidden');
        if (!hiddenChannels.length) { alert('⚠️ কোনো দৃশ্যমান হিডেন চ্যানেল নেই!'); return; }
        openHiddenPlayer(hiddenChannels);
    }).catch(() => alert('⚠️ hidden_channels.json পাওয়া যায়নি!'));
}
function loadPremiumContent() {
    fetch(URLS.premium).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
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
        applyQualityToPlayer(hiddenJwInstance);
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

    const hlsConfig = {
        enableWorker: true, useCues: true, lowLatencyMode: false,
        maxBufferLength: 24, maxMaxBufferLength: 48,
        maxBufferSize: 48 * 1000 * 1000, backBufferLength: 20,
        liveSyncDuration: 4, liveMaxLatencyDuration: 12, liveDurationInfinity: true,
        manifestLoadingTimeOut: 20000, manifestLoadingMaxRetry: 6,
        fragLoadingTimeOut: 30000, fragLoadingMaxRetry: 6,
        levelLoadingMaxRetry: 6,
        abrEwmaDefaultEstimate: 800000, abrBandWidthFactor: 0.9, abrBandWidthUpFactor: 0.7,
        abrMaxWithRealBitrate: true, startLevel: -1,
        xhrSetup: function(xhr) { xhr.withCredentials = false; xhr.timeout = 30000; }
    };

    hiddenJwInstance = jwplayer('hiddenPlayer').setup({
        file: channel.url, width: w, height: h,
        autostart: true, mute: false, primary: 'html5',
        hlsjsConfig: hlsConfig, androidhls: true,
        playbackRateControls: false, bufferLength: 12, preload: 'auto',
        analytics: { enabled: false }
    });

    hiddenJwInstance.on('ready', () => {
        setTimeout(() => {
            const r = container.getBoundingClientRect();
            try { hiddenJwInstance.resize(Math.floor(r.width), Math.floor(r.height)); } catch(e){}
        }, 100);
        applyQualityToPlayer(hiddenJwInstance);
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

/* ==================== MAIN PLAYER ==================== */
function showLoading(show) { loadingOverlay.classList.toggle('active', show); }

function setupPlayer(url, cb) {
    currentUrl = url;
    showLoading(true);

    const hlsConfig = {
        enableWorker: true, useCues: true, lowLatencyMode: false,
        maxBufferLength: 24, maxMaxBufferLength: 48,
        maxBufferSize: 48 * 1000 * 1000, backBufferLength: 20,
        liveSyncDuration: 4, liveMaxLatencyDuration: 12, liveDurationInfinity: true,
        manifestLoadingTimeOut: 20000, manifestLoadingMaxRetry: 6,
        manifestLoadingRetryDelay: 1000,
        fragLoadingTimeOut: 30000, fragLoadingMaxRetry: 6,
        levelLoadingMaxRetry: 6,
        abrEwmaDefaultEstimate: 800000, abrBandWidthFactor: 0.9, abrBandWidthUpFactor: 0.7,
        abrMaxWithRealBitrate: true, startLevel: -1,
        xhrSetup: function(xhr) { xhr.withCredentials = false; xhr.timeout = 30000; }
    };

    if (jwInstance) {
        jwInstance.load([{ file: url }]);
        jwInstance.play();
        if (cb) cb();
        applyQualityToPlayer(jwInstance);
        return;
    }

    jwInstance = jwplayer('player').setup({
        file: url, width: '100%', height: '100%',
        autostart: true, mute: false, primary: 'html5',
        hlsjsConfig: hlsConfig, androidhls: true,
        playbackRateControls: false, bufferLength: 12, preload: 'auto',
        analytics: { enabled: false }
    });

    jwInstance.on('play', () => {
        showLoading(false);
        if (cb) cb();
        applyQualityToPlayer(jwInstance);
    });
    jwInstance.on('levelsChanged', () => { updateAvailableLevelsDisplay(); });
    jwInstance.on('error', e => {
        showLoading(false);
        console.error('❌ Player Error:', e);
        nowPlaying.innerHTML = '<span class="live">⚠️</span> ' + (e.message || 'সমস্যা');
    });
    jwInstance.on('buffer', () => {
        showLoading(true);
        nowPlaying.innerHTML = '<span class="live">⏳ বাফার...</span>';
    });
    jwInstance.on('bufferFull', () => {
        showLoading(false);
        const ch = allChannels.find(c => c.url === currentUrl);
        if (ch) nowPlaying.innerHTML = '<span class="live">লাইভ</span> ' + ch.name;
    });
}

/* ==================== PIP ==================== */
pipBtn.addEventListener('click', async () => {
    if (!jwInstance) return;
    const video = jwInstance.getContainer()?.querySelector('video');
    if (!video) return;
    try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else await video.requestPictureInPicture();
    } catch(e){ console.log('PiP Error:', e); }
});

/* ==================== RANDOM / RELOAD ==================== */
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

/* ==================== FULLSCREEN ==================== */
function toggleFullscreen() {
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
        // ============ FULLSCREEN ON ============
       app.classList.add('fullscreen');
        fullscreenBtn.textContent = '✕';
        document.body.style.overflow = 'hidden';
        fsBackBtn.style.display = 'flex';

        // ✅ Browser native fullscreen (address bar লুকাবে)
        try {
            const el = document.documentElement;
            const reqFS = el.requestFullscreen 
                       || el.webkitRequestFullscreen 
                       || el.mozRequestFullScreen 
                       || el.msRequestFullscreen;
            if (reqFS) reqFS.call(el).catch(() => {});
        } catch(e) {}

        // ✅ Landscape force (mobile)
        try {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(() => {});
            }
        } catch(e) {}

        // ✅ Player resize — multi-timing
        const sizePlayer = () => {
            if (!jwInstance) return;
            const vp = window.visualViewport;
            const w = window.innerWidth;
            const h = Math.max(
                window.innerHeight,
                vp ? vp.height : 0,
                document.documentElement.clientHeight
            );
            try {
                jwInstance.resize(w, h);
                const container = document.getElementById('player');
                if (container) {
                    container.style.width = w + 'px';
                    container.style.height = h + 'px';
                }
            } catch(e) {}
        };
        setTimeout(sizePlayer, 30);
        setTimeout(sizePlayer, 100);
        setTimeout(sizePlayer, 300);
        setTimeout(sizePlayer, 600);
        setTimeout(sizePlayer, 1000);
        let count = 0;
        const interval = setInterval(() => {
            sizePlayer();
            if (++count > 10) clearInterval(interval);
        }, 200);

    } else {
        // ============ FULLSCREEN OFF ============
        app.classList.remove('fullscreen');
        fullscreenBtn.textContent = '⛶';
        document.body.style.overflow = '';
        fsBackBtn.style.display = 'none';

        try {
            const exitFS = document.exitFullscreen 
                        || document.webkitExitFullscreen 
                        || document.mozCancelFullScreen 
                        || document.msExitFullscreen;
            if (exitFS && document.fullscreenElement) exitFS.call(document).catch(() => {});
        } catch(e) {}

        try {
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        } catch(e) {}

        setTimeout(() => {
            if (!jwInstance) return;
            const c = document.querySelector('.video-wrap');
            if (c) {
                try {
                    jwInstance.resize(c.offsetWidth, c.offsetHeight);
                    const pc = document.getElementById('player');
                    if (pc) { pc.style.width = ''; pc.style.height = ''; }
                } catch(e) {}
            }
        }, 200);
    }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);
fsBackBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFullscreen) toggleFullscreen();
});
fsBackBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (isFullscreen) toggleFullscreen();
}, { passive: false });

/* ==================== KEYBOARD SHORTCUTS ==================== */
document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ' || e.key === 'Space') { e.preventDefault(); if (jwInstance) jwInstance.playPause(); }
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    if (e.key === 'm' || e.key === 'M') { if (jwInstance) { isMuted = !isMuted; jwInstance.setMute(isMuted); } }
    if (e.key === 'ArrowUp') { if (jwInstance) jwInstance.setVolume(Math.min(jwInstance.getVolume() + 10, 100)); }
    if (e.key === 'ArrowDown') { if (jwInstance) jwInstance.setVolume(Math.max(jwInstance.getVolume() - 10, 0)); }
    if (e.key === 'r' || e.key === 'R') reloadBtn.click();
    if (e.key === 'n' || e.key === 'N') randomBtn.click();
    if (e.key === 'q' || e.key === 'Q') {
        if (qualityOverlay?.classList.contains('active')) closeQualityModal();
        else openQualityModal();
    }
    if (e.key === 't' || e.key === 'T') {
        if (themeOverlay?.classList.contains('active')) closeThemeModal();
        else openThemeModal();
    }
    if (e.key === 'Escape') {
        if (isFullscreen) toggleFullscreen();
        else if (hiddenPlayerOverlay.classList.contains('active')) closeHiddenPlayer.click();
        else if (qualityOverlay.classList.contains('active')) closeQualityModal();
        else if (themeOverlay.classList.contains('active')) closeThemeModal();
        else if (helpOverlay.classList.contains('active')) closeOverlay(helpOverlay);
        else if (profileOverlay.classList.contains('active')) closeOverlay(profileOverlay);
    }
});

/* ==================== LOAD TV CHANNELS ==================== */
fetch(URLS.tv).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(data => {
        if (!data.channels?.length) {
            channelList.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#666;padding:30px;">কোন চ্যানেল পাওয়া যায়নি</div>';
            return;
        }
        allChannels = data.channels.filter(c => c.status !== 'hidden');
        buildCategoryTabs(allChannels);
        buildList(allChannels);
        if (allItems.length) allItems[0].click();
    })
    .catch(err => {
        console.error(err);
        channelList.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#888;padding:30px;">⚠️ tv_channels.json পাওয়া যায়নি</div>';
    });

/* ==================== BUILD CATEGORY TABS ==================== */
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

/* ==================== FAVORITES ==================== */
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

/* ==================== RECENT ==================== */
function getRecent() { try { return JSON.parse(localStorage.getItem('sbu_recent')) || []; } catch(e){ return []; } }
function pushRecent(name) {
    let r = getRecent().filter(x => x !== name);
    r.unshift(name); r = r.slice(0, 20);
    localStorage.setItem('sbu_recent', JSON.stringify(r));
    const countEl = document.querySelector('.cat-tab[data-cat="Recent"] .count');
    if (countEl) countEl.textContent = r.length;
}

/* ==================== BUILD LIST ==================== */
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
        });
        channelList.appendChild(div);
        allItems.push(div);
    });
    filterChannels();
    updateFavoriteButtons();
    const fc = document.querySelector('.cat-tab[data-cat="Favorites"] .count'); if (fc) fc.textContent = getFavorites().length;
    const rc = document.querySelector('.cat-tab[data-cat="Recent"] .count'); if (rc) rc.textContent = getRecent().length;
}

/* ==================== FILTER ==================== */
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

/* ==================== QUALITY SELECTOR ==================== */
function openQualityModal() {
    if (!qualityOverlay) return;
    qualityOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateQualityUI();
    updateAvailableLevelsDisplay();
}
function closeQualityModal() {
    if (!qualityOverlay) return;
    qualityOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (qualityBtn) qualityBtn.addEventListener('click', openQualityModal);
if (closeQualityBtn) closeQualityBtn.addEventListener('click', closeQualityModal);
if (qualityOverlay) qualityOverlay.addEventListener('click', e => {
    if (e.target === qualityOverlay) closeQualityModal();
});

if (qualityList) {
    qualityList.addEventListener('click', e => {
        const option = e.target.closest('.quality-option');
        if (!option) return;
        const quality = option.dataset.quality;
        preferredQuality = quality;
        localStorage.setItem('sbu_quality', quality);
        updateQualityUI();
        applyQualityToPlayer(jwInstance);
        applyQualityToPlayer(hiddenJwInstance);
        closeQualityModal();
        showQualityToast(quality);
    });
}

function updateQualityUI() {
    document.querySelectorAll('.quality-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.quality === preferredQuality);
    });
    if (qualityBtn) {
        if (preferredQuality === 'auto') {
            qualityBtn.textContent = '⚙️ অটো';
            qualityBtn.classList.remove('active-manual');
        } else {
            qualityBtn.textContent = '⚙️ ' + preferredQuality + 'p';
            qualityBtn.classList.add('active-manual');
        }
    }
}

function updateAvailableLevelsDisplay() {
    if (!jwInstance) {
        if (availableLevelsEl) availableLevelsEl.textContent = '--';
        if (currentLevelEl) currentLevelEl.textContent = '--';
        return;
    }
    try {
        const levels = jwInstance.getLevels();
        const current = jwInstance.getCurrentLevel();
        if (availableLevelsEl) {
            if (levels && levels.length) {
                const heights = levels.map(l => l.height ? l.height + 'p' : '?').join(', ');
                availableLevelsEl.textContent = heights;
            } else {
                availableLevelsEl.textContent = 'শুধু একটি';
            }
        }
        if (currentLevelEl) {
            if (levels && levels[current]) {
                currentLevelEl.textContent = levels[current].height ? levels[current].height + 'p' : '?';
            } else {
                currentLevelEl.textContent = '--';
            }
        }
    } catch(e) {
        if (availableLevelsEl) availableLevelsEl.textContent = '--';
        if (currentLevelEl) currentLevelEl.textContent = '--';
    }
}

function applyQualityToPlayer(player) {
    if (!player) return;
    try {
        const levels = player.getLevels();
        if (!levels || !levels.length) return;

        if (preferredQuality === 'auto') {
            player.setCurrentLevel(-1);
            return;
        }

        const targetHeight = parseInt(preferredQuality);
        let bestLevel = -1;
        let bestDiff = Infinity;
        levels.forEach((lv, i) => {
            if (!lv.height) return;
            const diff = Math.abs(lv.height - targetHeight);
            if (diff < bestDiff) { bestDiff = diff; bestLevel = i; }
        });
        if (bestLevel >= 0) {
            player.setCurrentLevel(bestLevel);
        }
    } catch(e) {
        console.log('Quality apply error:', e);
    }
}

function showQualityToast(quality) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: var(--gradient-premium); color: #fff; padding: 12px 24px;
        border-radius: 50px; font-weight: 700; font-size: 0.85rem;
        z-index: 99999; box-shadow: 0 8px 40px rgba(255, 215, 0, 0.4);
        animation: fadeInUp 0.3s ease; pointer-events: none; white-space: nowrap;
    `;
    toast.textContent = quality === 'auto'
        ? '🤖 অটো কোয়ালিটি চালু'
        : '✅ ' + quality + 'p সিলেক্ট করা হয়েছে';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s';
        setTimeout(() => toast.remove(), 400);
    }, 1800);
}

updateQualityUI();

/* ==================== WINDOW RESIZE ==================== */
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
    if (isFullscreen && jwInstance) {
        const vp = window.visualViewport;
        const w = window.innerWidth;
        const h = Math.max(window.innerHeight, vp ? vp.height : 0);
        try { jwInstance.resize(w, h); } catch(e){}
    }
});
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (hiddenJwInstance && hiddenPlayerOverlay.classList.contains('active')) {
            const c = document.querySelector('.hidden-video-wrap');
            const r = c.getBoundingClientRect();
            try { hiddenJwInstance.resize(Math.floor(r.width), Math.floor(r.height)); } catch(e){}
        }
        if (isFullscreen && jwInstance) {
            const vp = window.visualViewport;
            const w = window.innerWidth;
            const h = Math.max(window.innerHeight, vp ? vp.height : 0);
            try { jwInstance.resize(w, h); } catch(e){}
        }
    }, 300);
});

/* ==================== SHARE ==================== */
const shareGroup = document.createElement('div');
shareGroup.className = 'share-group';
shareGroup.style.cssText = 'display:flex; gap:4px;';
shareGroup.innerHTML = `
    <button class="btn" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href),'_blank')">📘 FB</button>
    <button class="btn" onclick="window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(window.location.href),'_blank')">💬 WA</button>`;
document.querySelector('.controls-group').appendChild(shareGroup);

console.log('%c✦ SBU TV Player Pro loaded ✦', 'color:#ffd700; font-weight:bold; font-size:14px;');
console.log('🎨 Current theme:', currentTheme);
console.log('🎬 Quality preference:', preferredQuality);
})();