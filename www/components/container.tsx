import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Container(props: Props) {
  const { children } = props;

  return (
    <section className="py-20 px-4 sm:px-20">
      <div className="max-w-screen-md m-auto">{children}</div>
    </section>
  );
}
