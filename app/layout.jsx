import "./globals.css";
import { AppProviders } from "./providers";
import Header from "@/components/Header";

export const metadata = {
  title: "Meridian Coffee",
  description:
    "Specialty coffee, roasted to order. Single origins, blends, decaf, and brewing equipment.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Header />
          <main>{children}</main>
          <footer className="site-footer">
            <div className="container">
              Meridian Coffee. A demo storefront built as a QA test fixture. No
              real orders are processed.
            </div>
          </footer>
        </AppProviders>
      </body>
    </html>
  );
}
