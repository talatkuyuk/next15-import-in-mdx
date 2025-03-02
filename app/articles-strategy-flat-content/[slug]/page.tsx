import { Suspense } from "react";
import type { Metadata } from "next";
import { getFrontmatter } from "next-mdx-remote-client/utils";
import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc";

import type { Frontmatter } from "@/types";
import { getRandomInteger } from "@/utils";
import { getMarkdownFromSlug, getMarkdownFiles, toSlug } from "@/utils/file";
import { components } from "@/mdxComponents";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { remarkPlugins, rehypePlugins, recmaPlugins } from "@/utils/plugins";

type Props = {
  params: Promise<{ slug: string }>;
};

const directory = "articles-strategy-flat-content";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const file = await getMarkdownFromSlug(directory, slug);

  if (!file) return {};

  const { frontmatter } = getFrontmatter<Frontmatter>(file.source);

  return {
    title: frontmatter.title ?? "Article",
  };
}

/**
 * "MDXRemote" to be rendered
 */
export default async function Post({ params }: Props) {
  const { slug } = await params;

  const result = await getMarkdownFromSlug(directory, slug);

  if (!result) {
    return <ErrorComponent error="The source could not found !" />;
  }

  const { source, format, path } = result;

  console.log({ path });

  const options: MDXRemoteOptions = {
    parseFrontmatter: true,
    scope: {
      readingTime: getRandomInteger(5, 10),
    },
    mdxOptions: {
      format,
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
      baseUrl: import.meta.url,
    },
  };

  return (
    <Suspense fallback={<LoadingComponent />}>
      <MDXRemote
        source={source}
        options={options}
        components={components}
        onError={ErrorComponent}
      />
    </Suspense>
  );
}

export async function generateStaticParams() {
  const files = getMarkdownFiles(directory);

  return files.map((filename) => ({
    slug: toSlug(filename),
  }));
}
