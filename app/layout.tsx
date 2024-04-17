import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tonario",
  description: "となりの人との交流を創出する座席決めアプリ",
};

type MainProps = {
  children:React.ReactNode
}

const RootLayout = (props:MainProps) => {
  return (
    <html lang="ja" className='w-[100%] h-[100%]' >
      <body className="w-[100%] h-[100%]">
        {props.children}
      </body>
    </html>
  );
}

export default RootLayout;
