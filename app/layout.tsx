import './globals.css'

export type LayoutProps = {
  children: React.ReactNode
}

export const revalidate = 30000;

export default async function RootLayout({ children }: LayoutProps) {


  return (
    <html lang="en">
      <head>
        <title>Gen-Gee</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

