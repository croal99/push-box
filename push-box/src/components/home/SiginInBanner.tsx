import {ConnectButton} from "@mysten/dapp-kit";

export function SiginInBanner() {
    return (
        <div className="flex flex-col items-center space-y-[20px]">
            <div className="bg-white flex flex-col p-[60px] max-w-[480px] mx-auto rounded-[24px] items-center space-y-[60px]">
                <div className="flex flex-col space-y-[30px] items-center">
                    <div className="flex flex-col space-y-[20px] items-center">
                        <div className="font-[700] text-[20px] text-center">
                            Sign In and Play <br /> Let's PUSH
                        </div>
                        <div className="text-center text-opacity-90 text-[14px] text-[#4F4F4F]">
                            Welcome to Mysten Blackjack – where blockchain meets Blackjack!
                            Experience the fusion of cutting-edge technology and classic card
                            gaming. Login now for a seamless, fair, and thrilling adventure on
                            the Sui blockchain. Good luck at the tables!
                        </div>
                    </div>
                    <ConnectButton />
                </div>
            </div>
        </div>
    )
}