import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Container(props: Props) {
  const { children } = props;

  return (
    <section className="p-20">
      <div className="max-w-screen-md">{children}</div>
    </section>
  );
}
