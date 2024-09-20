import { ragChat } from "@/lib/rag-chat";

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
  console.log("Params", params);

  await ragChat.context.add({
    type: "html",
    source: reconstructedUrlValue,
    config: { chunkSize: 200, chunkOverlap: 50 },
  });

  return <h1>Hello</h1>;
};

export default Page;
