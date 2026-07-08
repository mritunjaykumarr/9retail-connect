import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import AuthSessionProvider from "../../components/AuthSessionProvider";
import { ToastProvider } from "../../components/ui/Toast/ToastProvider";
import "./globals.scss";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jbmono",
  display: "swap",
});

// Runs before paint to set the persisted theme with no flash of the
// wrong theme (FOUC). Falls back to light.
const themeScript = `(function(){try{var t=localStorage.getItem('rc-theme');if(t!=='dark'&&t!=='light'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export const metadata = {
  title: "RetailConnect SIP — Design System",
  description:
    "Enterprise design system and component library for RetailConnect SIP, the field-sales & distribution platform for FMCG.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${sora.variable} ${jakarta.variable} ${jbmono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AuthSessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
