export interface Post {
    id: string;
    imageUrl?: string;
    userId: string;
    lat: number;
    lng: number;
    category: string;
    comment: string;
    reported: boolean;
    deleted: boolean;
    visible: boolean;
    point: number;
    postType: string;
    postedby?: string | null;
  }