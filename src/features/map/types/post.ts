// types/post.ts
export interface Post {
    id: string;
    imageUrl?: string; // null を除外
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
    __typename: "PostData";
    owner?: string | null;
  }
  