export interface Character {
    id: number;
    name: string;
    image: string;
    rarity: string;
    speed: number;
}

export const charactersData: Character[] = [
    { id: 1, name: 'Nico Yazawa', image: '/idol/nico-yazawa-6.jpg', rarity: 'UR', speed: 4 },
    { id: 2, name: 'Maki Nishikino', image: '/idol/maki-nishikino-6.jpg', rarity: 'SR', speed: 2 },
    { id: 3, name: 'Kotori Minami', image: '/idol/kotori-minami-7.jpg', rarity: 'R', speed: 1 },
    { id: 4, name: 'Rina Tennoji', image: '/idol/rina-tennoji-2.jpg', rarity: 'SSR', speed: 3 },
    { id: 5, name: 'Eli Ayase', image: '/idol/eli-ayase-6.jpg', rarity: 'SSR', speed: 3 },
    { id: 6, name: 'Honoka Kousaka', image: '/idol/honoka-kousaka-6.jpg', rarity: 'SR', speed: 2 },
    { id: 7, name: 'Nozomi Toujou', image: '/idol/nozomi-toujou-7.jpg', rarity: 'R', speed: 1 },
    { id: 8, name: 'Riamu Yumemi', image: '/idol/riamu-yumemi-3.jpg', rarity: 'UR', speed: 4 },
    { id: 9, name: 'Rin Hoshizora', image: '/idol/rin-hoshizora-5.jpg', rarity: 'SR', speed: 2 },
    { id: 10, name: 'Setsuna Yuki', image: '/idol/setsuna-yuki-5.jpg', rarity: 'SSR', speed: 3 },
    { id: 11, name: 'Umi Sonoda', image: '/idol/umi-sonoda-6.jpg', rarity: 'SR', speed: 2 },
    { id: 12, name: 'Hanayo Koizumi', image: '/idol/hanayo-koizumi-6.jpg', rarity: 'SR', speed: 2 },
    { id: 13, name: 'Kanata Konoe', image: '/idol/kanata-konoe-7.jpg', rarity: 'SSR', speed: 3 },
    { id: 14, name: 'Mahiru Hiiragi', image: '/idol/mahiru-hiiragi-2.jpg', rarity: 'SR', speed: 2 },

];