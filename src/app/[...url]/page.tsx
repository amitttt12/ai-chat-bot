import { ChatWrapper } from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";

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
  const reconstructedUrlValue = reconstructedUrl({
    url: params.url as string[],
  });
  // console.log("Params", params);

  const sessionId = "mock-session";

  const isAlreadyIndexed = await redis.sismember(
    "indexed-urls",
    reconstructedUrlValue
  );

  // console.log("is already indexed", isAlreadyIndexed)  ;
  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrlValue,
      config: { chunkSize: 200, chunkOverlap: 50 },
    });

    await redis.sadd("indexed-urls", reconstructedUrlValue);
  }

  return <ChatWrapper sessionId={sessionId} />;
};

export default Page;
