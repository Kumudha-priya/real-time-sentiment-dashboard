import "./globals.css";
import Sidebar from "../components/Sidebar";
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}:Readonly< {
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class"
         defaultTheme="system"
         enableSystem>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}