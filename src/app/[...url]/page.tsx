import { ChatWrapper } from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

function reconstructedUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) =>
    decodeURIComponent(component)
  );
  return decodedComponents.join("/");
}

const Page = async ({ params }: PageProps) => {
  const sessionCookie = cookies().get("sessionId")?.value;
  const reconstructedUrlValue = reconstructedUrl({
    url: params.url as string[],
  });

  const sessionId = (reconstructedUrlValue + "--" + sessionCookie).replace(
    /\//g,
    ""
  );

  const isAlreadyIndexed = await redis.sismember(
    "indexed-urls",
    reconstructedUrlValue
  );

  const initialMessages = await ragChat.history.getMessages({amount:10,sessionId});

  // console.log("is already indexed", isAlreadyIndexed)  ;
  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrlValue,
      config: { chunkSize: 200, chunkOverlap: 50 },
    });

    await redis.sadd("indexed-urls", reconstructedUrlValue);
  }

  return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages}/>;
};

export default Page;
