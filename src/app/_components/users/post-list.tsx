"use client";

import { api } from "@/trpc/react";
import { FC } from "react";

interface PostListProps {
  lists?: string[];
}

const PostList = ({}) => {
  const [lists] = api.admin.getAllPosts.useSuspenseQuery();
  return (
    <ul>
      {lists.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
};

export default PostList;
