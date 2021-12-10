import React from "react";
import Container from "./container";
import Link from "./lib/link";

interface FooterHeaderProps {
  title: string;
}

function FooterHeader(props: FooterHeaderProps) {
  const { title } = props;

  return <h5 className="mb-5 font-medium text-2xl">{title}</h5>;
}

interface FooterParagraphProps {
  children: React.ReactNode;
}

function FooterParagraph(props: FooterParagraphProps) {
  const { children } = props;

  return <p className="mb-5">{children}</p>;
}

export default function Footer() {
  return (
    <div className="text-slate-300">
      <Container>
        <>
          <FooterHeader title="About" />
          <FooterParagraph>
            p2p.chat is a free and open source project. Contributions or bug
            reports are extremely welcome at{" "}
            <Link external href="https://github.com/tom-james-watson/p2p.chat">
              https://github.com/tom-james-watson/p2p.chat
            </Link>
            .
          </FooterParagraph>
          <FooterHeader title="Contact" />
          <FooterParagraph>
            For any help or feedback, please contact{" "}
            <Link external href="mailto:support@p2p.chat">
              support@p2p.chat
            </Link>
            .
          </FooterParagraph>
          <FooterParagraph>
            For press, or any other queries, please get in touch at{" "}
            <Link external href="mailto:p2pchat@tomjwatson.com">
              p2pchat@tomjwatson.com
            </Link>
            .
          </FooterParagraph>
          <FooterHeader title="Legal" />
          <FooterParagraph>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </FooterParagraph>
          <FooterParagraph>
            <Link href="/terms-and-conditions">Terms and Conditions</Link>
          </FooterParagraph>
          <FooterParagraph>
            Created by{" "}
            <Link external href="https://tomjwatson.com">
              tomjwatson.com
            </Link>
            .
          </FooterParagraph>
        </>
      </Container>
    </div>
  );
}
