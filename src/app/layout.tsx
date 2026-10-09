import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basket Career Sim - Football Manager Edition",
  description: "Simulação de carreira de basquete com interface autêntica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const htmlBodyStyle = {
    backgroundColor: '#0a0c0c',
    margin: 0,
    padding: 0,
    height: '100%',
    overflow: 'hidden'
  };

  return (
    <html lang="pt-BR" style={htmlBodyStyle}>
      <body style={htmlBodyStyle}>
        {children}
      </body>
    </html>
  );
}