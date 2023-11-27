import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAccount } from "wagmi";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const socialAccounts = [
  {
    title: "Github",
    logo: "/github.svg",
    comingSoon: false,
    description:
      "Connect your github account to verify your proof-of-account-ownership and earn achievements related to your code commits and activity.",
    step1: "Edit your Github profile to include the following link",
    step2: "Do the next thing",
    modalImage: "/connectgithub.png",
  },
  {
    title: "BuidlGuidl",
    logo: "/link.svg",
    comingSoon: false,
    description:
      "Connect your buidlguidl account to verify your proof-of-account-ownership and earn achievements related to your scaffold-eth-2 builds, your role and your stream.",
    step1: "On your buidlguidl profile page, update your status to the following link",
    step2: "Do the next thing",
    modalImage: "/connectbuidlguidl.png",
  },
  {
    title: "Buildbox",
    logo: "/link.svg",
    comingSoon: true,
    description:
      "Connect your buildbox.io account to verify your proof-of-account-ownership and earn achievements related to hackathons and bounties.",
    step1: "",
    modalImage: "",
  },
  {
    title: "GitCoin Passport",
    logo: "/passport.svg",
    comingSoon: true,
    description:
      "Connect your gitcoin passport to verify your proof-of-account-ownership and earn achievements related to your number of points.",
    step1: "",
    modalImage: "",
  },
  {
    title: "X / Twitter",
    logo: "/link.svg",
    comingSoon: true,
    description:
      "Connect your twitter/X account to verify your proof-of-account-ownership and earn achievements related to your level of activity and connections on crypto twitter.",
    step1: "",
    modalImage: "",
  },
  {
    title: "LinkedIn",
    logo: "/linkedin.svg",
    comingSoon: true,
    description:
      "Connect your linkedin account to verify your proof-of-account-ownership and earn achievements related to your number of connections and your Web3 employment.",
    step1: "",
    modalImage: "",
  },
];

export const ConnectSocialAccounts = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const account = useAccount(); // EOA connected to rainbow kit

  const [copied, setCopied] = useState(false);

  const { data: profile } = useScaffoldContractRead({
    contractName: "upRegistry",
    functionName: "up",
    args: [account.address],
  });

  const renderModalContent = (title: string) => {
    const account = socialAccounts.find(account => account.title === title);

    const link = `https://updev-nextjs.vercel.app/profile/${profile && profile[2]}`;
    return (
      <div className="flex gap-5 items-center">
        <div className="rounded-lg overflow-hidden">
          {account?.modalImage && <Image alt="brand logo" width={300} height={400} src={account?.modalImage} />}
        </div>
        <div>
          <h2 className="text-2xl font-bold">How to Connect {account?.title}</h2>
          <ol className="list-decimal list-inside">
            <li className="text-xl">{account?.step1}</li>
            <div className="flex items-center gap-4">
              <div className="w-[600px] border border-white p-3 rounded-xl my-3 overflow-x-auto whitespace-nowrap hide-scrollbar">
                {link}
              </div>
              <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
                <button className="">
                  {copied ? (
                    <CheckCircleIcon className="w-6 cursor-pointer" />
                  ) : (
                    <DocumentDuplicateIcon className="w-6 cursor-pointer" />
                  )}
                </button>
              </CopyToClipboard>
            </div>
            <li className="text-xl">{account?.step2}</li>
          </ol>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full gap-5">
        {socialAccounts.map(item => (
          <div
            key={item.title}
            className="flex bg-base-100 w-full p-5 justify-between items-center rounded-xl border border-base-200 gap-24"
          >
            <div>
              <div className="flex gap-3 items-center mb-3">
                <Image alt="brand logo" width={24} height={24} src={item.logo} />
                <h5 className="text-xl font-bold">{item.title}</h5>
                {item.comingSoon && (
                  <div className="text-accent font-semibold border-2 border-accent rounded-md px-1">Coming soon</div>
                )}
              </div>
              <p className="text-base-content my-0">{item.description}</p>
            </div>
            <button onClick={() => setActiveModal(item.title)} className="btn btn-primary" disabled={item.comingSoon}>
              Connect
            </button>
          </div>
        ))}
      </div>
      {activeModal && (
        <Modal isOpen={activeModal !== null} onClose={() => setActiveModal(null)}>
          {renderModalContent(activeModal)}
        </Modal>
      )}
    </div>
  );
};
