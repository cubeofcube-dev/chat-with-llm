import { TStartupConfig } from 'librechat-data-provider';

function Footer({ startupConfig }: { startupConfig: TStartupConfig | null | undefined }) {
  if (!startupConfig) {
    return null;
  }
  const privacyPolicyRender = false;
  const termsOfServiceRender = false;

  return (
    <div className="align-end m-4 flex justify-center gap-2" role="contentinfo">
      {privacyPolicyRender}
      {privacyPolicyRender && termsOfServiceRender && (
        <div className="border-r-[1px] border-gray-300 dark:border-gray-600" />
      )}
      {termsOfServiceRender}
    </div>
  );
}

export default Footer;
