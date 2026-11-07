// ================================
// GAME DATABASE - ISI Game Switch
// ================================
//
// ============================================================
//  CARA MENAMBAH GAME BARU:
// ============================================================
//
//  1. Copy template di bawah ini
//  2. Paste di akhir array GAMES_DATABASE (sebelum kurung tutup "]")
//  3. Isi datanya sesuai game yang mau ditambah
//  4. Save file, lalu refresh website
//
//  TEMPLATE:
//  {
//      id: __,                          // <-- Nomor urut unik (lanjutkan dari game terakhir)
//      title: "Nama Game",             // <-- Judul game
//      genre: "action",                // <-- Genre: action, adventure, rpg, racing, sport, puzzle, fighting, simulation, platformer
//      size: "10.0 GB",                // <-- Ukuran file
//      badge: null,                    // <-- Badge: "new", "popular", atau null (kosong)
//      description: "Deskripsi game",  // <-- Deskripsi singkat
//      players: "1 Player",           // <-- Jumlah pemain
//      dlc: false,                     // <-- true jika include DLC, false jika tidak
//      version: "v1.0.0",             // <-- Versi game
//      image: ""                       // <-- URL gambar cover (kosongkan "" untuk auto-generate)
//  },
//
// ============================================================
//  CARA THUMBNAIL OTOMATIS:
// ============================================================
//
//  - Jika "image" dikosongkan (""), thumbnail otomatis dibuat dari
//    gradient warna genre + judul game sebagai teks overlay.
//
//  - Jika ingin pakai gambar sendiri, isi "image" dengan:
//    a. URL online:   "https://example.com/cover.jpg"
//    b. File lokal:   "covers/nama-game.jpg"
//       (taruh file gambar di folder "covers/" dalam folder website)
//
//  - Ukuran gambar yang disarankan: 600x800px (rasio 3:4)
//
// ============================================================

const GAMES_DATABASE = [

    // ─────────────────────────────────────
    //  ACTION
    // ─────────────────────────────────────

    {
        id: 1,
        title: "The Legend of Zelda: Tears of the Kingdom",
        genre: "action",
        size: "16.3 GB",
        badge: "popular",
        description: "Sekuel dari Breath of the Wild. Jelajahi dunia Hyrule yang luas dengan kemampuan baru yang menakjubkan. Build, fuse, dan explore tanpa batas!",
        players: "1 Player",
        dlc: false,
        version: "v1.2.1",
        image: ""
    },
    {
        id: 2,
        title: "The Legend of Zelda: Breath of the Wild",
        genre: "action",
        size: "14.4 GB",
        badge: "popular",
        description: "Open-world adventure legendaris. Jelajahi Hyrule, selesaikan shrine, dan kalahkan Calamity Ganon.",
        players: "1 Player",
        dlc: true,
        version: "v1.6.0",
        image: ""
    },
    {
        id: 3,
        title: "Bayonetta 3",
        genre: "action",
        size: "15.0 GB",
        badge: null,
        description: "Action game stylish dengan combo yang mendebarkan. Kendalikan Bayonetta dalam petualangan multiverse.",
        players: "1-2 Players",
        dlc: false,
        version: "v1.2.0",
        image: ""
    },
    {
        id: 4,
        title: "Monster Hunter Rise: Sunbreak",
        genre: "action",
        size: "13.2 GB",
        badge: "dlc",
        description: "Berburu monster raksasa bersama teman! Termasuk expansion Sunbreak dengan konten baru.",
        players: "1-4 Players",
        dlc: true,
        version: "v16.0.2",
        image: ""
    },
    {
        id: 5,
        title: "Hyrule Warriors: Age of Calamity",
        genre: "action",
        size: "13.5 GB",
        badge: null,
        description: "Musou game berlatar 100 tahun sebelum BOTW. Hack & slash dengan karakter favorit dari Zelda.",
        players: "1-2 Players",
        dlc: true,
        version: "v1.3.0",
        image: ""
    },
    {
        id: 6,
        title: "Astral Chain",
        genre: "action",
        size: "9.6 GB",
        badge: null,
        description: "Action game dari PlatinumGames. Kendalikan polisi dan Legion untuk membasmi chimera.",
        players: "1-2 Players",
        dlc: false,
        version: "v1.0.1",
        image: ""
    },
    {
        id: 7,
        title: "Splatoon 3",
        genre: "action",
        size: "6.0 GB",
        badge: "popular",
        description: "Shooter unik dengan tinta! Turf War, Salmon Run, dan TableTurf Battle. Online multiplayer seru!",
        players: "1-8 Players",
        dlc: true,
        version: "v6.0.1",
        image: ""
    },
    {
        id: 8,
        title: "Hades",
        genre: "action",
        size: "3.0 GB",
        badge: "popular",
        description: "Roguelike GOTY! Zagreus kabur dari Underworld. Gameplay adiktif, cerita brilian.",
        players: "1 Player",
        dlc: false,
        version: "v1.38",
        image: ""
    },
    {
        id: 9,
        title: "Diablo III: Eternal Collection",
        genre: "action",
        size: "17.5 GB",
        badge: null,
        description: "ARPG legendaris dengan loot tanpa habis. Termasuk Reaper of Souls & Rise of the Necromancer.",
        players: "1-4 Players",
        dlc: true,
        version: "v2.7.0",
        image: ""
    },
    {
        id: 10,
        title: "NieR:Automata - The End of YoRHa Edition",
        genre: "action",
        size: "10.8 GB",
        badge: null,
        description: "Action RPG dengan cerita yang mind-blowing. Android 2B & 9S dalam perang melawan mesin.",
        players: "1 Player",
        dlc: true,
        version: "v1.0.2",
        image: ""
    },
    {
        id: 11,
        title: "Dark Souls Remastered",
        genre: "action",
        size: "4.2 GB",
        badge: null,
        description: "Action RPG ultra-challenging. Prepare to die. Explore Lordran dan kalahkan boss yang brutal.",
        players: "1 Player",
        dlc: true,
        version: "v1.0.3",
        image: ""
    },

    // ─────────────────────────────────────
    //  ADVENTURE
    // ─────────────────────────────────────

    {
        id: 12,
        title: "Super Mario Odyssey",
        genre: "adventure",
        size: "5.7 GB",
        badge: "popular",
        description: "Petualangan Mario terbaik! Jelajahi berbagai kingdom bersama Cappy. Capture musuh dan jadi mereka!",
        players: "1-2 Players",
        dlc: false,
        version: "v1.3.0",
        image: ""
    },
    {
        id: 13,
        title: "Metroid Dread",
        genre: "adventure",
        size: "4.3 GB",
        badge: "new",
        description: "Samus Aran kembali! Action-adventure 2D yang intens dengan E.M.M.I. yang menakutkan.",
        players: "1 Player",
        dlc: false,
        version: "v1.0.3",
        image: ""
    },
    {
        id: 14,
        title: "Luigi's Mansion 3",
        genre: "adventure",
        size: "6.5 GB",
        badge: null,
        description: "Luigi harus menyelamatkan teman-temannya dari hotel berhantu! Puzzle-adventure yang seru dan lucu.",
        players: "1-2 Players",
        dlc: true,
        version: "v1.4.0",
        image: ""
    },
    {
        id: 15,
        title: "Pikmin 4",
        genre: "adventure",
        size: "9.8 GB",
        badge: "new",
        description: "Pimpin pasukan Pikmin untuk mengeksplorasi dunia baru, selesaikan puzzle, dan kumpulkan harta.",
        players: "1-2 Players",
        dlc: false,
        version: "v1.0.2",
        image: ""
    },
    {
        id: 16,
        title: "Kirby and the Forgotten Land",
        genre: "adventure",
        size: "5.8 GB",
        badge: "popular",
        description: "Petualangan 3D pertama Kirby! Mouthful Mode yang unik, world yang penuh warna, dan boss fight seru.",
        players: "1-2 Players",
        dlc: false,
        version: "v1.0.1",
        image: ""
    },
    {
        id: 17,
        title: "It Takes Two",
        genre: "adventure",
        size: "6.7 GB",
        badge: "new",
        description: "GOTY co-op adventure! Harus dimainkan berdua. Level design paling kreatif yang pernah ada.",
        players: "2 Players",
        dlc: false,
        version: "v1.0.4",
        image: ""
    },

    // ─────────────────────────────────────
    //  RPG
    // ─────────────────────────────────────

    {
        id: 18,
        title: "Xenoblade Chronicles 3",
        genre: "rpg",
        size: "13.7 GB",
        badge: "popular",
        description: "JRPG epik dengan cerita mendalam, battle system kompleks, dan dunia yang sangat luas.",
        players: "1 Player",
        dlc: true,
        version: "v2.1.1",
        image: ""
    },
    {
        id: 19,
        title: "Pokemon Scarlet",
        genre: "rpg",
        size: "6.7 GB",
        badge: "popular",
        description: "Open-world Pokemon pertama! Jelajahi region Paldea, tangkap Pokemon baru, dan jadi Champion.",
        players: "1-4 Players",
        dlc: true,
        version: "v3.0.1",
        image: ""
    },
    {
        id: 20,
        title: "Pokemon Violet",
        genre: "rpg",
        size: "6.7 GB",
        badge: "popular",
        description: "Versi Violet dengan Legendary Pokemon Miraidon. Tera Type system untuk strategi baru!",
        players: "1-4 Players",
        dlc: true,
        version: "v3.0.1",
        image: ""
    },
    {
        id: 21,
        title: "Fire Emblem Engage",
        genre: "rpg",
        size: "11.3 GB",
        badge: "new",
        description: "Tactical RPG terbaik! Summon hero legendaris dari seluruh seri Fire Emblem.",
        players: "1 Player",
        dlc: true,
        version: "v2.0.0",
        image: ""
    },
    {
        id: 22,
        title: "Octopath Traveler II",
        genre: "rpg",
        size: "5.2 GB",
        badge: "new",
        description: "HD-2D RPG yang indah dengan 8 cerita unik. Sistem pertempuran Turn-Based yang adiktif.",
        players: "1 Player",
        dlc: false,
        version: "v1.0.2",
        image: ""
    },
    {
        id: 23,
        title: "Shin Megami Tensei V",
        genre: "rpg",
        size: "11.4 GB",
        badge: null,
        description: "JRPG dark dan challenging. Rekrut demon, fuse mereka, dan tentukan nasib Tokyo.",
        players: "1 Player",
        dlc: true,
        version: "v1.0.2",
        image: ""
    },
    {
        id: 24,
        title: "Pokemon Legends: Arceus",
        genre: "rpg",
        size: "6.1 GB",
        badge: null,
        description: "Pokemon di era feudal! Gameplay baru, tangkap Pokemon di open-world tanpa battle turn-based.",
        players: "1 Player",
        dlc: false,
        version: "v1.1.1",
        image: ""
    },
    {
        id: 25,
        title: "Persona 5 Royal",
        genre: "rpg",
        size: "11.8 GB",
        badge: "popular",
        description: "JRPG terbaik dekade ini! Phantom Thieves mencuri hati orang jahat. Style, story, soundtrack semua top.",
        players: "1 Player",
        dlc: false,
        version: "v1.0.2",
        image: ""
    },
    {
        id: 26,
        title: "Triangle Strategy",
        genre: "rpg",
        size: "5.1 GB",
        badge: null,
        description: "Tactical RPG HD-2D dari Square Enix. Pilihan cerita yang bercabang berdasarkan keputusanmu.",
        players: "1 Player",
        dlc: false,
        version: "v1.1.0",
        image: ""
    },

    // ─────────────────────────────────────
    //  RACING
    // ─────────────────────────────────────

    {
        id: 27,
        title: "Mario Kart 8 Deluxe",
        genre: "racing",
        size: "7.0 GB",
        badge: "popular",
        description: "Racing game #1 di Switch! 96 track dengan Booster Course Pass, 42 characters. Multiplayer yang seru!",
        players: "1-8 Players",
        dlc: true,
        version: "v3.0.1",
        image: ""
    },
    {
        id: 28,
        title: "Need for Speed: Hot Pursuit Remastered",
        genre: "racing",
        size: "7.1 GB",
        badge: null,
        description: "Arcade racing klasik yang diremasterkan. Kejar atau dikejar polisi dalam balapan penuh adrenalin.",
        players: "1-2 Players",
        dlc: false,
        version: "v1.0.3",
        image: ""
    },
    {
        id: 29,
        title: "Crash Team Racing: Nitro-Fueled",
        genre: "racing",
        size: "5.5 GB",
        badge: null,
        description: "Remake dari CTR PS1 klasik. Kart racing seru dengan karakter Crash Bandicoot.",
        players: "1-4 Players",
        dlc: false,
        version: "v1.0.15",
        image: ""
    },

    // ─────────────────────────────────────
    //  SPORT
    // ─────────────────────────────────────

    {
        id: 30,
        title: "Nintendo Switch Sports",
        genre: "sport",
        size: "2.8 GB",
        badge: "popular",
        description: "Spiritual successor Wii Sports! Tennis, Bowling, Soccer, Badminton, Volleyball, dan Chambara.",
        players: "1-4 Players",
        dlc: false,
        version: "v1.4.0",
        image: ""
    },
    {
        id: 31,
        title: "FIFA 23 Legacy Edition",
        genre: "sport",
        size: "7.2 GB",
        badge: null,
        description: "Game sepak bola populer dengan roster terbaru. Career mode dan Ultimate Team.",
        players: "1-4 Players",
        dlc: false,
        version: "v1.0.2",
        image: ""
    },
    {
        id: 32,
        title: "NBA 2K24",
        genre: "sport",
        size: "10.5 GB",
        badge: "new",
        description: "Simulasi basket terbaik. MyCareer, MyTeam, dan gameplay realistis.",
        players: "1-4 Players",
        dlc: false,
        version: "v1.04",
        image: ""
    },
    {
        id: 33,
        title: "Ring Fit Adventure",
        genre: "sport",
        size: "2.5 GB",
        badge: null,
        description: "Fitness game RPG yang seru! Olahraga sambil bermain game adventure.",
        players: "1 Player",
        dlc: false,
        version: "v1.3.0",
        image: ""
    },

    // ─────────────────────────────────────
    //  PUZZLE
    // ─────────────────────────────────────

    {
        id: 34,
        title: "Tetris 99",
        genre: "puzzle",
        size: "0.5 GB",
        badge: null,
        description: "Tetris battle royale! Bertanding melawan 99 pemain lain. Siapa yang bertahan terakhir menang!",
        players: "1-99 Players",
        dlc: true,
        version: "v3.0.0",
        image: ""
    },
    {
        id: 35,
        title: "Puyo Puyo Tetris 2",
        genre: "puzzle",
        size: "2.9 GB",
        badge: null,
        description: "Gabungan Puyo Puyo dan Tetris! Dua game puzzle legendaris dalam satu paket.",
        players: "1-4 Players",
        dlc: false,
        version: "v2.1.0",
        image: ""
    },
    {
        id: 36,
        title: "Captain Toad: Treasure Tracker",
        genre: "puzzle",
        size: "1.6 GB",
        badge: null,
        description: "Puzzle adventure 3D yang menggemaskan. Putar kamera, cari jalan, dan kumpulkan harta.",
        players: "1-2 Players",
        dlc: true,
        version: "v1.3.0",
        image: ""
    },

    // ─────────────────────────────────────
    //  FIGHTING
    // ─────────────────────────────────────

    {
        id: 37,
        title: "Super Smash Bros. Ultimate",
        genre: "fighting",
        size: "16.1 GB",
        badge: "popular",
        description: "SEMUA karakter game ada di sini! 89 fighters, 100+ stages. Fighting game terlengkap sepanjang masa.",
        players: "1-8 Players",
        dlc: true,
        version: "v13.0.1",
        image: ""
    },
    {
        id: 38,
        title: "Dragon Ball FighterZ",
        genre: "fighting",
        size: "4.2 GB",
        badge: null,
        description: "2D fighting game dengan visual anime yang memukau. Pertarungan 3v3 yang seru!",
        players: "1-6 Players",
        dlc: true,
        version: "v1.31",
        image: ""
    },
    {
        id: 39,
        title: "Mortal Kombat 11",
        genre: "fighting",
        size: "22.5 GB",
        badge: null,
        description: "Fighting game brutal dan ikonik. Story mode epik dan fatality yang intens!",
        players: "1-2 Players",
        dlc: true,
        version: "v1.0.10",
        image: ""
    },

    // ─────────────────────────────────────
    //  SIMULATION
    // ─────────────────────────────────────

    {
        id: 40,
        title: "Animal Crossing: New Horizons",
        genre: "simulation",
        size: "7.1 GB",
        badge: "popular",
        description: "Bangun pulau impianmu! Dekorasi, berkebun, memancing, dan berteman dengan penduduk yang lucu.",
        players: "1-8 Players",
        dlc: true,
        version: "v2.0.6",
        image: ""
    },
    {
        id: 41,
        title: "Stardew Valley",
        genre: "simulation",
        size: "0.9 GB",
        badge: "popular",
        description: "Farming RPG yang adiktif. Bertani, berteman, mining, dan menikah. Game indie terbaik!",
        players: "1-4 Players",
        dlc: false,
        version: "v1.6.0",
        image: ""
    },
    {
        id: 42,
        title: "Minecraft",
        genre: "simulation",
        size: "1.2 GB",
        badge: "popular",
        description: "Game sandbox legendaris. Build, survive, explore dunia blok tanpa batas kreativitasmu.",
        players: "1-8 Players",
        dlc: false,
        version: "v1.21",
        image: ""
    },
    {
        id: 43,
        title: "Cities: Skylines",
        genre: "simulation",
        size: "4.8 GB",
        badge: null,
        description: "City builder terbaik! Bangun kota impianmu dari nol. Atur traffic, zone, dan budget.",
        players: "1 Player",
        dlc: true,
        version: "v1.1.0",
        image: ""
    },

    // ─────────────────────────────────────
    //  PLATFORMER
    // ─────────────────────────────────────

    {
        id: 44,
        title: "Super Mario Bros. Wonder",
        genre: "platformer",
        size: "4.5 GB",
        badge: "new",
        description: "Mario 2D terbaru dengan Wonder Flower yang mengubah level! Multiplayer 4 pemain.",
        players: "1-4 Players",
        dlc: false,
        version: "v1.0.1",
        image: ""
    },
    {
        id: 45,
        title: "Donkey Kong Country: Tropical Freeze",
        genre: "platformer",
        size: "6.6 GB",
        badge: null,
        description: "Platformer hardcore dengan level design terbaik. DK Island diserang Viking!",
        players: "1-2 Players",
        dlc: false,
        version: "v1.0.2",
        image: ""
    },
    {
        id: 46,
        title: "Celeste",
        genre: "platformer",
        size: "1.2 GB",
        badge: null,
        description: "Precision platformer yang menantang dengan cerita menyentuh tentang anxiety dan self-discovery.",
        players: "1 Player",
        dlc: false,
        version: "v1.4.0",
        image: ""
    },
    {
        id: 47,
        title: "Hollow Knight",
        genre: "platformer",
        size: "4.1 GB",
        badge: "popular",
        description: "Metroidvania masterpiece! Explore kerajaan serangga yang misterius. Boss fight yang epik.",
        players: "1 Player",
        dlc: false,
        version: "v1.5.0",
        image: ""
    },
    {
        id: 48,
        title: "Rayman Legends: Definitive Edition",
        genre: "platformer",
        size: "3.7 GB",
        badge: null,
        description: "Platformer dengan art style yang indah. Rhythmic level yang unik dan multiplayer seru.",
        players: "1-4 Players",
        dlc: false,
        version: "v1.0.1",
        image: ""
    },
    {
        id: 49,
        title: "Super Mario 3D All-Stars",
        genre: "platformer",
        size: "5.3 GB",
        badge: null,
        description: "Koleksi 3 game Mario klasik: Super Mario 64, Sunshine, dan Galaxy dalam HD!",
        players: "1-2 Players",
        dlc: false,
        version: "v1.1.1",
        image: ""
    },
    {
        id: 50,
        title: "Ori and the Will of the Wisps",
        genre: "platformer",
        size: "5.1 GB",
        badge: null,
        description: "Metroidvania yang sangat indah dan emosional. Platforming presisi dengan cerita yang mengharukan.",
        players: "1 Player",
        dlc: false,
        version: "v1.2.0",
        image: ""
    }
];
