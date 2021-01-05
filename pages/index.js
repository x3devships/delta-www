import { useI18n } from 'next-rosetta';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useContext } from 'react';
import TransactionButton from '../components/Button/TransactionButton';
import { ModalContext } from '../contexts';

export default function Home() {
  const modalContext = useContext(ModalContext);
  const { locale, locales, route } = useRouter();
  const i18n = useI18n();
  const { t } = i18n;

  const onTransaction = async () => {
    if (await modalContext.showConfirm('Confirmation', 'Please confirm you are there')) {
      await modalContext.showError('Error', 'Example error message');
    }
  };

  return (
    <div>
      <Head>
        <title>{t('locale')}</title>
      </Head>
      <main>
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
        <p>{t('welcome', { name: 'John' })}</p>
        <ul>
          {locales?.map(loc => (
            <li key={loc}>
              <Link href={route} locale={loc}>
                <a className={loc === locale ? 'is-active' : ''}>{loc}</a>
              </Link>
            </li>
          ))}
        </ul>
        <TransactionButton text="Button" onClick={onTransaction} />
      </main>
    </div>
  );
}

export const getStaticProps = async context => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../i18n/${locale}`); // Import locale
  return { props: { table } }; // Passed to `/pages/_app.tsx`
};
