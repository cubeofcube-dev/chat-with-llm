import { ThemeContext, TranslationKeys, useLocalize } from '~/hooks';
import { BlinkAnimation } from './BlinkAnimation';
import { TStartupConfig } from 'librechat-data-provider';
import SocialLoginRender from './SocialLoginRender';
import { ThemeSelector } from '~/components/ui';
import { Banner } from '../Banners';
import Footer from './Footer';
import { useContext } from 'react';

const ErrorRender = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-16 flex justify-center">
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-gray-600 dark:text-gray-200"
    >
      {children}
    </div>
  </div>
);

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: TranslationKeys | null;
}) {
  const localize = useLocalize();
  const { theme } = useContext(ThemeContext);
  const hasStartupConfigError = startupConfigError !== null && startupConfigError !== undefined;
  const DisplayError = () => {
    if (hasStartupConfigError) {
      return <ErrorRender>{localize('com_auth_error_login_server')}</ErrorRender>;
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <ErrorRender>
          {localize('com_auth_error_invalid_reset_token')}{' '}
          <a className="font-semibold text-green-600 hover:underline" href="/forgot-password">
            {localize('com_auth_click_here')}
          </a>{' '}
          {localize('com_auth_to_try_again')}
        </ErrorRender>
      );
    } else if (error != null && error) {
      return <ErrorRender>{localize(error)}</ErrorRender>;
    }
    return null;
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Banner />
      <BlinkAnimation active={isFetching}>
        <div className="ml-8 mt-6 flex h-10 w-[25vw] flex-row md:w-1/4 lg:w-48">
          <img src={theme === 'dark' ? '/assets/ks-dark.png' : '/assets/ks.png'} className="ml-2 h-full w-full object-contain" alt="fonund" />
          <div className="mx-4 border-r-[1px] border-gray-300 dark:border-gray-600" />
          <img
            src="/assets/logo.svg"
            className="h-full w-full object-contain"
            alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'CubeChat' })}
          />
          <div className="mx-4 border-r-[1px] border-gray-300 dark:border-gray-600" />
          <img
            src={theme === 'dark' ? '/assets/cube-dark.png' : '/assets/cube.png'}
            className="h-full w-full object-contain"
            alt="fonund"
          />
        </div>
      </BlinkAnimation>
      <DisplayError />
      <div className="absolute bottom-0 left-0 md:m-4">
        <ThemeSelector />
      </div>

      <div className="flex flex-grow items-center justify-center">
        <div className="w-authPageWidth overflow-hidden bg-white px-6 py-4 dark:bg-gray-900 sm:max-w-md sm:rounded-lg">
          {children}
          {!pathname.includes('2fa') &&
            (pathname.includes('login') || pathname.includes('register')) && (
            <SocialLoginRender startupConfig={startupConfig} />
          )}
        </div>
      </div>
      <Footer startupConfig={startupConfig} />
    </div>
  );
}

export default AuthLayout;
