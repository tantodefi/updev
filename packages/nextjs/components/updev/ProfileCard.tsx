import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import { convertIpfsUrl } from "~~/utils/helpers";

export function ProfileCard({ upAddress }: { upAddress: string }) {
  const [metadata, setMetadata] = useState<any>(null);

  console.log("metadata", metadata);

  useEffect(() => {
    async function fetchData() {
      if (upAddress) {
        const lsp3ProfileSchemaModule = await import("@erc725/erc725.js/schemas/LSP3ProfileMetadata.json");
        const lsp3ProfileSchema = lsp3ProfileSchemaModule.default;
        const erc725js = new ERC725(
          lsp3ProfileSchema as ERC725JSONSchema[],
          upAddress,
          "https://rpc.lukso.gateway.fm",
          {
            ipfsGateway: "https://api.universalprofile.cloud/ipfs",
          },
        );
        try {
          const profileMetaData = await erc725js.fetchData("LSP3Profile");
          setMetadata(profileMetaData.value);
        } catch (error) {
          console.error("Error fetching ERC725 data:", error);
        }
      }
    }
    fetchData();
  }, [upAddress]);

  if (!metadata)
    return (
      <div className="flex justify-center grow">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const backgroundImage = metadata.LSP3Profile.backgroundImage[1].url;
  const profileImage = metadata.LSP3Profile.profileImage[0].url;

  const backgroundStyle = {
    backgroundImage: `url(${convertIpfsUrl(backgroundImage)})`,
    backgroundSize: "cover", // To cover the entire area of the div
    backgroundPosition: "center", // To center the background image
  };

  return (
    <Link
      href={`/profile/${upAddress}`}
      style={backgroundStyle}
      className="relative bg-base-200 w-full h-80 rounded-3xl flex flex-col justify-end shadow-2xl shadow-[#FFFFFF30] transition duration-300 ease-in-out hover:scale-105"
    >
      <div className="absolute top-1/2 z-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden border-[10px] w-32 h-32 border-neutral-900">
        <Image alt="profile picture" width={1000} height={1000} src={convertIpfsUrl(profileImage)} />
      </div>
      <div className="h-1/2 z-0 flex flex-col bg-neutral-900 justify-end items-center rounded-3xl gap-4 pb-6">
        <div className="font-bold">
          @{metadata.LSP3Profile.name}
          <span className="ml-1 text-accent">#{upAddress.slice(2, 6)}</span>
        </div>
        <div className="flex gap-2 h-[30px]">
          {metadata.LSP3Profile.tags.map((tag: string) => (
            <div
              key={tag}
              className="text-neutral-800 font-semibold bg-accent px-2 py-0.5 rounded-md border border-base-200"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}