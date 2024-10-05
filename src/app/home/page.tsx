'use client'
import React, { useState, useEffect } from "react";
import { View, Heading, Button } from "@aws-amplify/ui-react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listPostData} from "../../graphql/queries";
import { createPostData} from "../../graphql/mutations";
import { generateClient } from 'aws-amplify/api';
import FooterNavBar from "@/components/footer";
import { uploadData, getUrl } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import awsExports from './../../aws-exports';
Amplify.configure(awsExports);

const client = generateClient();

interface Post {
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
}



const PostComponent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [formData, setFormData] = useState({
    userId: "",
    lat: "",
    lng: "",
    category: "",
    comment: "",
    image: null as File | null,
    reported: false,
    deleted: false,
    visible: true,
    point: 0,
    postType: "POST"
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<string[]>(["Nature", "Technology", "Art", "Science", "History"]);

  useEffect(() => {
    console.log('generaeted client',client)
    fetchPostData();
    getUserLocation();
  }, []);

  // カテゴリを追加する関数
  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory(""); // 入力欄をリセット
    }
  };

  // ユーザーの位置情報を取得する関数
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          }));
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error obtaining geolocation", error);
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  // 投稿データを取得する関数
  async function fetchPostData() {
    const apiData = await client.graphql({ query: listPostData });
    const postsFromAPI = apiData.data.listPostData.items;
    await Promise.all(
      postsFromAPI.map(async (post: Post) => {
        if (post.imageUrl) {
          const url = await getUrl({ key: post.imageUrl });
          post.imageUrl = url.url;
        }
        return post;
      })
    );
    setPosts(postsFromAPI);
  }

  // 投稿を作成する関数
  async function createPost(event: React.FormEvent) {
    event.preventDefault();
    const { userId, lat, lng, category, comment, image, reported, deleted, visible, point, postType } = formData;

    const postData = {
      userId,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      category,
      comment,
      reported,
      deleted,
      visible,
      point,
      postType,
      imageUrl: image?.name ? image.name : null 
    };
    await client.graphql({
      query: createPostData,
      variables: { input: postData },

    });

    if (image) {
      await uploadData({ key: image.name, data: image });
    }

    

    // fetchPostData();
    setFormData({
      userId: "",
      lat: "",
      lng: "",
      category: "",
      comment: "",
      image: null,
      reported: false,
      deleted: false,
      visible: true,
      point: 0,
      postType: "POST"
    });
  }

  // フォームの入力を処理する関数
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFormData({ ...formData, category: event.target.value });
  }

  return (
    <div>
      <h1>Create a Post</h1>
      <form onSubmit={createPost}>
        <input
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleInputChange}
        />
        <div>
          {loadingLocation ? (
            <p>Loading location...</p>
          ) : (
            <>
              <input
                name="lat"
                placeholder="Latitude"
                value={formData.lat}
                readOnly
              />
              <input
                name="lng"
                placeholder="Longitude"
                value={formData.lng}
                readOnly
              />
            </>
          )}
        </div>
        <select name="category" value={formData.category} onChange={handleCategoryChange}>
          <option value="" disabled>Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div>
          <input
            name="newCategory"
            placeholder="Add a new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="button" onClick={addCategory}>Add Category</button>
        </div>
        <textarea
          name="comment"
          placeholder="Comment"
          value={formData.comment}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="image"
          onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
        />
        <button type="submit">Create Post</button>
      </form>

      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.category}</h3>
            <p>{post.comment}</p>
            {post.imageUrl && <img src={post.imageUrl} alt={post.category} style={{ maxWidth: "200px" }} />}
            <p>Location: ({post.lat}, {post.lng})</p>
            <p>Reported: {post.reported ? "Yes" : "No"}</p>
            <p>Deleted: {post.deleted ? "Yes" : "No"}</p>
            <p>Visible: {post.visible ? "Yes" : "No"}</p>
            <p>Points: {post.point}</p>
            <p>Posted by: {post.userId}</p>
          </li>
        ))}
      </ul>
      <FooterNavBar />
    </div>
  );
};

export default withAuthenticator(PostComponent);
