import type { Metadata } from "next";
import Link from "next/link";

import { getPostInformation, getMarkdownFiles } from "@/utils/file";
import type { Post } from "@/types";

export const metadata: Metadata = {
  title: "Ipikuka Articles with Flat Content Strategy",
};

const directory = "data/articles-strategy-flat-content";
const path = "/articles-strategy-flat-content/";

export default async function Articles() {
  const files = getMarkdownFiles(directory);

  const posts = files
    .map((file) => getPostInformation(directory, file))
    .filter((post): post is Post => post !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <h1>Articles with Flat Content Strategy</h1>
      <ul className="articles">
        {posts.map((post) => (
          <li key={post.title}>
            <strong>
              <Link href={path + post.slug}>{post.title}</Link>
            </strong>
            <p>
              <span>{String(post.date)}, </span>
              <span>
                written by <strong>{post.author}</strong>
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
