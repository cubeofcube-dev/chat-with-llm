import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import TagManager from 'react-gtm-module';
import { useGetStartupConfig } from '~/data-provider';

export default function Footer({ className }: { className?: string }) {
  const { data: config } = useGetStartupConfig();
  const privacyPolicyRender = false;

  const termsOfServiceRender = false;

  const mainContentParts = [(typeof config?.customFooter === 'string') ? config?.customFooter : 'Powered by 金山孵化中心'];

  useEffect(() => {
    if (config?.analyticsGtmId != null && typeof window.google_tag_manager === 'undefined') {
      const tagManagerArgs = {
        gtmId: config.analyticsGtmId,
      };
      TagManager.initialize(tagManagerArgs);
    }
  }, [config?.analyticsGtmId]);

  const mainContentRender = mainContentParts.map((text, index) => (
    <React.Fragment key={`main-content-part-${index}`}>
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node: _n, href, children, ...otherProps }) => {
            return (
              <a
                className="text-text-secondary underline"
                href={href}
                target="_blank"
                rel="noreferrer"
                {...otherProps}
              >
                {children}
              </a>
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          p: ({ node: _n, ...props }) => <span {...props} />,
        }}
      >
        {text.trim()}
      </ReactMarkdown>
    </React.Fragment>
  ));

  const footerElements = [...mainContentRender, privacyPolicyRender, termsOfServiceRender].filter(
    Boolean,
  );

  return (
    <div
      className={
        className ??
        'relative flex items-center justify-center gap-2 px-2 py-2 text-center text-xs text-gray-600 dark:text-gray-300 text-text-primary md:px-[60px]'
      }
      role="contentinfo"
    >
      {footerElements.map((contentRender, index) => {
        const isLastElement = index === footerElements.length - 1;
        return (
          <React.Fragment key={`footer-element-${index}`}>
            {contentRender}
            {!isLastElement && (
              <div key={`separator-${index}`} className="h-2 border-r-[1px] border-border-medium" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
