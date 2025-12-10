import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bombando Hoje | Melhores Ofertas de Tecnologia',
  description: 'Encontre notebook gamer, celulares e periféricos com os melhores preços. Curadoria de ofertas do Mercado Livre.',
  openGraph: {
    title: 'Bombando Hoje | Ofertas Tech e Gamer',
    description: 'As melhores ofertas de tecnologia garimpadas para você.',
    url: 'https://bombando-hoje-loja.vercel.app',
    siteName: 'Bombando Hoje',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bombando Hoje | Ofertas Tech',
    description: 'Ofertas diárias de tecnologia e setup gamer.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}