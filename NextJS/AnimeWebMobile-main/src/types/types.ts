// types/types.ts
export interface Anime {
  id: string;
  attributes: {
    titles: {
      en: string;
      en_jp: string;
      ja_jp: string;
    };
    posterImage: {
      large: string;
    };
    subtype: string;
    status: string;
  };
}

export interface KitsuResponse {
  data: Anime[];
}
