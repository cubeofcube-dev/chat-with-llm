import { Globe } from 'lucide-react';
import { TooltipAnchor } from '~/components';
import { useLocalize } from '~/hooks';
import { useCallback, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import store from '~/store';

function SearchWeb() {
  const localize = useLocalize();
  const webSearch = useRecoilValue(store.isWebSearch);
  const setIsWebSearch = useSetRecoilState(store.isWebSearch);

  const clickHandler = useCallback(() => {
    setIsWebSearch((prev) => !prev);
  }, [setIsWebSearch]);

  const tooltipText = useMemo(
    () => (webSearch ? localize('com_ui_enable_search') : localize('com_ui_disable_search')),
    [webSearch, localize],
  );

  return (
    <TooltipAnchor
      id="com_nav_browser-button"
      aria-label={tooltipText}
      description={tooltipText}
      tabIndex={0}
      role="button"
      onClick={clickHandler}
      data-testid="search-web-button"
      className={`inline-flex size-10 items-center justify-center rounded-lg border border-border-light bg-transparent text-text-primary transition-all ease-in-out ${
        webSearch ? 'bg-surface-tertiary' : ''
      } hover:bg-surface-tertiary radix-state-open:bg-surface-tertiary`}
    >
      <Globe
        size={16}
        aria-label="Globe Icon"
        style={{ color: webSearch ? 'rgb(99, 102, 241)' : undefined }}
      />
    </TooltipAnchor>
  );
}

export default SearchWeb;
