import React from "react";
import NextLink from "next/link";

interface Props {
  children: React.ReactNode;
  external?: boolean;
  href: string;
}

export default function Link(props: Props) {
  const { children, external = false, href } = props;
  const className =
    "text-yellow-400 hover:text-yellow-500 focus:text-yellow-500 underline";

  if (external) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink passHref href={href}>
      <a className={className}>{children}</a>
    </NextLink>
  );
}
