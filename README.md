
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SBU SUMON HASAN Premium Apps & Tech Solution</title>
    
    <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "x64wu0njiu");
    </script>
    
    <link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary-color: #00f2fe;
            --secondary-color: #4facfe;
            --accent-color: #ff4757;
            --bg-color: #060913;
            --card-bg: rgba(21, 29, 48, 0.65);
            --border-color: rgba(255, 255, 255, 0.08);
            --text-color: #f1f5f9;
            --text-muted: #94a3b8;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Hind Siliguri', 'Poppins', Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.7;
            overflow-x: hidden;
            background-image: radial-gradient(circle at 50% 0%, #101b33 0%, #060913 70%);
            -webkit-font-smoothing: antialiased;
        }

        header {
            background: linear-gradient(135deg, rgba(15, 32, 39, 0.8), rgba(44, 83, 100, 0.8));
            backdrop-filter: blur(10px);
            padding: 60px 15px 70px 15px;
            text-align: center;
            border-bottom: 2px solid rgba(0, 242, 254, 0.3);
            position: relative;
        }

        header h1 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            text-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
            margin-bottom: 12px;
        }

        header p {
            font-size: 1.05rem;
            color: #cbd5e1;
            max-width: 600px;
            margin: 0 auto;
        }

        .profile-container {
            text-align: center;
            margin-top: -50px;
            margin-bottom: 30px;
            position: relative;
            z-index: 10;
        }

        .profile-img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid var(--primary-color);
            box-shadow: 0 0 30px rgba(0, 242, 254, 0.6);
            background-color: #151d30;
            transition: transform 0.3s ease;
        }

        .container {
            max-width: 850px;
            margin: 0 auto;
            padding: 0 20px 60px 20px;
        }
        
        .section {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border-color);
            width: 100%;
        }

        .section-title {
            color: var(--primary-color);
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 20px;
            border-left: 4px solid var(--primary-color);
            padding-left: 12px;
        }

        .welcome-box {
            background: linear-gradient(180deg, rgba(21, 29, 48, 0.8), rgba(15, 23, 42, 0.9));
            text-align: center;
        }

        .large-photo-box {
            text-align: center;
            overflow: hidden;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: #090d16;
            padding: 8px;
            margin-top: 20px;
        }

        .large-photo {
            width: 100%;
            max-width: 500px;
            height: auto;
            border-radius: 8px;
            display: block;
            margin: 0 auto;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease;
        }

        /* 📺 স্মার্ট টিভি রেডি লাইভ প্লেয়ার কন্টেইনার */
        .live-notice {
            background: rgba(255, 71, 87, 0.08);
            border: 1px dashed var(--accent-color);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            color: #ff8793;
            font-size: 0.95rem;
            text-align: left;
        }

        .video-container {
            position: relative;
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid rgba(0, 242, 254, 0.4);
            box-shadow: 0 0 30px rgba(0, 242, 254, 0.2);
            background: #000;
        }

        /* টিভি এবং বড় স্ক্রিনে ছবি ফাটা রোধ করার সিএসএস */
        .video-js {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 16 / 9;
        }
        
        .video-js .vjs-tech {
            object-fit: contain !important; /* ভিডিও স্ট্রেচ বা ফেটে যাওয়া প্রতিরোধ করবে */
        }

        /* 📦 ইনডিপেনডেন্ট আইফ্রেম স্ক্রলিং বক্স (১০০% আলাদা স্ক্রল) */
        .embed-server-box {
            background: #090d16;
            border: 1px solid rgba(0, 242, 254, 0.3);
            border-radius: 14px;
            overflow: hidden;
            margin-top: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.5);
        }

        .embed-server-header {
            background: #111827;
            padding: 12px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.95rem;
            color: #38bdf8;
            font-weight: 600;
        }

        .embed-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #10b981;
            box-shadow: 0 0 8px #10b981;
            animation: pulse 1.5s infinite;
        }

        /* এই কন্টেইনারটি বাইরের পেজকে লক রেখে শুধুমাত্র নিজেকে স্ক্রল করতে বাধ্য করবে */
        .embed-container-scroll {
            width: 100%;
            height: 480px; 
            overflow-y: auto; /* বক্সের ভেতরে ভার্টিকাল স্ক্রল চালু */
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch; /* মোবাইলে স্মুথ স্ক্রলিং এর জন্য */
            position: relative;
        }

        .embed-container-scroll iframe {
            width: 100%;
            height: 100%;
            border: none;
            background: #ffffff;
        }
        
        @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.6; }
        }

        /* 📥 ডাউনলোড বক্স */
        .download-box {
            background: #090d16;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            text-align: center;
        }

        .download-info h3 {
            color: #38bdf8;
            font-size: 1.2rem;
            margin-bottom: 6px;
        }

        .download-info p {
            font-size: 0.88rem;
            color: var(--text-muted);
        }

        .btn-download {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: #060913 !important;
            padding: 14px 24px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 242, 254, 0.2);
        }

        .btn-download:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 242, 254, 0.4);
        }

        /* 🛡️ ব্যাজ বক্স */
        .badge-box {
            background: linear-gradient(45deg, rgba(6, 78, 59, 0.4), rgba(17, 24, 39, 0.6));
            border: 1px solid #10b981;
            padding: 20px;
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 15px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }

        .badge-icon { font-size: 2.2rem; }

        /* 🎛️ গ্রিড ও সার্ভিস কার্ড */
        .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .feature-card {
            background: rgba(9, 13, 22, 0.6);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-3px);
            border-color: rgba(56, 189, 248, 0.3);
            background: rgba(9, 13, 22, 0.8);
        }

        .feature-card h3 {
            color: #38bdf8;
            font-size: 1.15rem;
            margin-bottom: 8px;
        }

        .feature-card p {
            font-size: 0.92rem;
            color: #cbd5e1;
        }

        /* 📞 বাটন গ্রুপ ও কন্টাক্ট */
        .btn-group {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
            width: 100%;
        }

        .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 14px 15px;
            border-radius: 10px;
            text-decoration: none;
            color: white !important;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .btn-whatsapp { background: linear-gradient(135deg, #25D366, #128C7E); }
        .btn-facebook { background: linear-gradient(135deg, #1877F2, #0f62fe); }
        .btn-mail { background: linear-gradient(135deg, #EA4335, #c53023); }
        .btn-call { background: linear-gradient(135deg, #10b981, #059669); }

        /* 📱 রেসপন্সিভ ব্রেকপয়েন্ট (টিভি ও ডেক্সটপ ফ্রেন্ডলি) */
        @media (min-width: 650px) {
            header { padding: 70px 20px 80px 20px; }
            header h1 { font-size: 2.5rem; }
            .profile-container { margin-top: -60px; }
            .profile-img { width: 120px; height: 120px; }
            .section { padding: 35px; }
            .section-title { font-size: 1.5rem; }
            .download-box { flex-direction: row; text-align: left; justify-content: space-between; align-items: center; }
            .btn-download { width: auto; }
            .grid { grid-template-columns: 1fr 1fr; } 
            .badge-box { flex-direction: row; text-align: left; padding: 25px; }
            .btn-group { grid-template-columns: 1fr 1fr; } 
        }

        .footer {
            text-align: center;
            margin-top: 50px;
            font-size: 0.9rem;
            color: var(--text-muted);
            padding: 30px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            background: rgba(9, 13, 22, 0.4);
        }
    </style>
</head>
<body>
    
<header>
    <h1>SBU Premium App Store</h1>
    <p>সফটওয়্যার ডাউনলোড এবং যেকোনো টেক রিলেটেড সমস্যার ওয়ান-স্টপ সল্যুশন</p>
</header>

<div class="profile-container">
    <img src="profile.webp" alt="SBU Sumon Hasan" class="profile-img" />
</div>

<div class="container">
    
    <div class="section welcome-box">
        <h2 style="color: var(--primary-color); margin-bottom: 12px; font-size: 1.5rem;">আমাদের ওয়েবসাইটে আপনাকে স্বাগতম</h2>
        <p style="font-size: 1rem; color: #cbd5e1; max-width: 700px; margin: 0 auto;">আজকের ডিজিটাল যুগে আমাদের প্রতিদিনের নানা কাজের জন্য বিভিন্ন প্রিমিয়াম অ্যাপ এবং ফাইল প্রয়োজন হয়। কিন্তু ইন্টারনেটে থাকা সাধারণ মোড অ্যাপগুলো অনেক সময় ম্যালওয়্যার বা ভাইরাসে ভরা থাকে। আপনার এই দুশ্চিন্তা দূর করতেই আমার এই নিরাপদ উদ্যোগ!</p>
        
        <div class="large-photo-box">
            <img src="my-profile.jpg" alt="SBU Sumon Hasan Large Photo" class="large-photo" />
        </div>
    </div>

    <div class="section" style="text-align: center;">
        <h2 class="section-title" style="border: none; padding: 0; color: var(--accent-color); text-shadow: 0 0 15px rgba(255,71,87,0.2);">🔴 win-Sports লাইভ সম্প্রচার</h2>
        
        <div class="live-notice">
            <strong>⚠️ বিশেষ নোটিশ:</strong><br>
            এই লাইভ টিভি চ্যানেলটি <strong>শুধুমাত্র সরাসরি খেলা চলার সময়ই সচল (Active) করা হয়</strong>। খেলা না থাকলে সার্ভারটি সাময়িকভাবে বন্ধ থাকে। ম্যাচ শুরু হওয়ার পর পেজটি রিফ্রেশ করুন, খেলা অটোমেটিক চালু হয়ে যাবে। বড় স্ক্রিন বা টিভিতে দেখার জন্য প্লেয়ারের ডানদিকের স্কয়ার বাটনে ক্লিক করে ফুল-স্ক্রিন করুন।
        </div>
        
        <div class="video-container">
            <video 
                id="live-tv-player" 
                class="video-js vjs-default-skin vjs-big-play-centered vjs-show-control-bar" 
                controls 
                preload="auto" 
                width="640"
                height="360"
                data-setup='{"fluid": true, "playbackRates": [1], "controlBar": {"pictureInPictureToggle": true, "fullscreenToggle": true}}'>
                <source src="http://198.195.239.50:8095/tsports/index.m3u8" type="application/x-mpegURL">
                <p class="vjs-no-js">
                    এই ভিডিওটি দেখার জন্য ব্রাউজারে জাভাস্ক্রিপ্ট সচল করা প্রয়োজন।
                </p>
            </video>
        </div>

        <div class="embed-server-box">
            <div class="embed-server-header">
                <div class="embed-dot"></div>
                <span>সংযুক্ত লোকাল সার্ভার / এফটিপি পোর্টাল (ইনডিপেনডেন্ট স্ক্রল বক্স)</span>
            </div>
            <div class="embed-container-scroll">
                <iframe src="http://198.195.239.50/" allowfullscreen></iframe>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">📥 অফিশিয়াল অ্যান্ড্রয়েড অ্যাপ ডাউনলোড</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.95rem;">আমাদের ওয়েবসাইটটি আরও সহজে ব্যবহার করতে এবং সরাসরি স্মার্ট টিভি বা ফোনে খেলা দেখতে নিচের বাটন থেকে আমাদের অফিশিয়াল অ্যাপটি ডাউনলোড করে ইনস্টল করে নিন।</p>
        
        <div class="download-box">
            <div class="download-info">
                <h3>SBU Premium App Store (v1.0)</h3>
                <p>ফাইল টাইপ: অফিশিয়াল এপিকে | রিকোয়ারমেন্ট: Android 5.0 বা তার উপরে</p>
            </div>
            <a href="https://drive.google.com/file/d/11YLQzaMvfh3ZSLAlHuVmJm19RiPl25Aj/view?usp=drivesdk=" target="_blank" class="btn-download">
                ⬇️ ডাউনলোড এপিকে (APK)
            </a>
        </div>
    </div>

    <div class="badge-box">
        <div class="badge-icon">🛡️</div>
        <div>
            <h3 style="margin: 0; color: #34d399; font-size: 1.2rem; font-weight: 600;">১০০% অ্যান্টিভাইরাস দ্বারা পরীক্ষিত ও নিরাপদ</h3>
            <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 0.95rem; text-align: left;">আমার এখানে উপলব্ধ প্রতিটি অ্যাপ বা জিপ ফাইল আপলোড করার আগে <strong>Kaspersky, Bitdefender</strong> এবং <strong>VirusTotal</strong>-এর মাধ্যমে স্ক্যান করা হয়। আমরা শতভাগ গ্যারান্টি দিচ্ছি যে এখানে কোনো ভাইরাস, ক্ষতিকারক কোড বা ট্রোজান নেই। আপনার ডিভাইসের নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার।</p>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">আমরা যেসব সেবা ও সমাধান দিয়ে থাকি</h2>
        <div class="grid">
            <div class="feature-card">
                <h3>💎 প্রিমিয়াম অ্যাপস ও গেমস</h3>
                <p>যেকোনো ট্রেন্ডিং এবং কাজের অ্যাপসের প্রো, অ্যাড-ফ্রি এবং প্রিমিয়াম মেম্বারশিপ ভার্সন খুব সাশ্রয়ী মূল্যে পেয়ে যাবেন আমাদের কাছে।</p>
            </div>
            <div class="feature-card">
                <h3>🛠️ অ্যাপস ক্র্যাশ ও এরর ফিক্স</h3>
                <p>আপনার ফোনে কোনো দরকারি অ্যাপ ওপেন হচ্ছে না বা বারবার ক্র্যাশ করছে? আমাদের জানান, আমরা কোড লেভেলে এর সমাধান করে দেবো।</p>
            </div>
            <div class="feature-card">
                <h3>📱 অ্যান্ড্রয়েড ও ওএস কাস্টমাইজেশন</h3>
                <p>ফোনের স্লো পারফরম্যান্স ফিক্স করা, কাস্টম লোগো তৈরি, অ্যাপের ইন্টারনাল সোর্স কোড মডিফিকেশনসহ যেকোনো টেকনিক্যাল সাপোর্ট।</p>
            </div>
            <div class="feature-card">
                <h3>📡 ওয়াই-ফাই ও নেটওয়ার্ক সল্যুশন</h3>
                <p>আপনার লোকাল নেটওয়ার্ক, ওয়াই-ফাই রাউটার কনফিগারেশন বা যেকোনো কানেক্টিভিটি সমস্যার দ্রুত এবং কার্যকরী সমাধান।</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">কেন আমাদের ওপর আস্থা রাখবেন?</h2>
        <ul style="padding-left: 20px; color: #cbd5e1; font-size: 0.95rem;">
            <li style="margin-bottom: 10px;"><strong>লাইফটাইম সাপোর্ট:</strong> আমাদের কাছ থেকে নেওয়া যেকোনো অ্যাপের পরবর্তী আপডেট বা সমস্যায় পাবেন আজীবন ফ্রি কাস্টমার সাপোর্ট।</li>
            <li style="margin-bottom: 10px;"><strong>ওয়ান-ক্লিক ইনস্টলেশন:</strong> কোনো জটিল সেটআপ ছাড়াই অ্যাপগুলো সরাসরি ফোনে ইনস্টল করতে পারবেন।</li>
            <li style="margin-bottom: 10px;"><strong>সরাসরি লাইভ চ্যাট:</strong> যেকোনো সমস্যার জন্য কোনো ফর্ম পূরণ করতে হবে না, সরাসরি আমাদের সাথে কথা বলুন।</li>
        </ul>
    </div>

    <div class="section" style="text-align: center;">
        <h2 class="section-title" style="border: none; padding: 0; text-align: center;">আমাদের সাথে যোগাযোগ করুন</h2>
        <p style="color: var(--text-muted); margin-bottom: 25px; font-size: 0.95rem;">যেকোনো অ্যাপ অর্ডার করতে বা আপনার ফোনের যেকোনো সমস্যার তাৎক্ষণিক সমাধান পেতে নিচে দেওয়া আমাদের অফিশিয়াল মাধ্যমে নক দিন। আমরা ২৪/৭ আপনাদের সেবায় নিয়োজিত।</p>
        
        <div class="btn-group">
            <a href="https://wa.me/8801960678584" target="_blank" class="btn btn-whatsapp" rel="noopener"> 💬 হোয়াটসঅ্যাপে মেসেজ </a>
            <a href="https://www.facebook.com/md.shumon.hasan.2023" target="_blank" class="btn btn-facebook" rel="noopener"> 🔷 অফিশিয়াল ফেসবুক </a>
            <a href="tel:+8801960678584" class="btn btn-call"> 📞 সরাসরি কল করুন </a>
            <a href="mailto:sumonhasan249@gmail.com?subject=Tech%20Support%20&amp;%20App%20Request" class="btn btn-mail"> ✉️ ইমেইল সাপোর্ট </a>
        </div>
    </div>
</div>

<div class="footer">
    <p>© 2026 SBU Sumon Hasan. All Rights Reserved.</p>
    <p style="font-size: 0.8rem; color: #475569; margin-top: 5px;">Designed for ultimate security and professional tech management.</p>
</div>

<script src="https://vjs.zencdn.net/8.10.0/video.js"></script>

<script>
    // প্লেয়ার ইনিশিয়ালাইজেশন এবং রেসপন্সিভনেস কনফিগারেশন
    var player = videojs('live-tv-player', {
        responsive: true,
        fluid: true,
        liveui: true
    });
</script>

</body>
</html>