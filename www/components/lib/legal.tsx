interface LegalHeaderProps {
  title: string;
}

export function LegalHeader(props: LegalHeaderProps) {
  const { title } = props;

  return <h5 className="mb-5 font-medium text-4xl">{title}</h5>;
}

interface LegalSubHeaderProps {
  title: string;
}

export function LegalSubHeader(props: LegalSubHeaderProps) {
  const { title } = props;

  return <h5 className="mb-5 font-medium text-2xl">{title}</h5>;
}

interface LegalParagraphProps {
  children: React.ReactNode;
}

export function LegalParagraph(props: LegalParagraphProps) {
  const { children } = props;

  return <p className="mb-5">{children}</p>;
}
