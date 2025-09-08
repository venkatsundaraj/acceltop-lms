import PostForm from "@/app/_components/users/post-form";
import PostList from "@/app/_components/users/post-list";
import { appRouter } from "@/server/api/root";
import { api, HydrateClient } from "@/trpc/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContext } from "@/trpc/server";
import SuperJSON from "superjson";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface pageProps {}

const page = async ({}: pageProps) => {
  //   const api = createServerSideHelpers({
  //     router: appRouter,
  //     ctx: await createContext(),
  //     transformer: SuperJSON,
  //   });
  //   await api.admin.getAllPosts.prefetch();
  //   const dehydratedState = dehydrate(api.queryClient);

  const posts = await api.admin.getAllPosts();
  return (
    <HydrateClient>
      <section className="w-screen h-screen flex flex-col items-center justify-center gap-24">
        <PostForm />
        <Suspense fallback={<p>Loading...</p>}>
          <PostList />
        </Suspense>
      </section>
    </HydrateClient>
  );
};

export default page;
