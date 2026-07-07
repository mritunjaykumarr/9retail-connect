import "./globals.scss";

export const metadata = {
  title: "Retail Connect",
  description: "Retail Connect application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
