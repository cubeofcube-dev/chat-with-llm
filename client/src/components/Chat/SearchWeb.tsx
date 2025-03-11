import { Globe } from 'lucide-react';
import { TooltipAnchor } from '~/components';
import { useLocalize } from '~/hooks';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import store from '~/store';

function SearchWeb() {
  const localize = useLocalize();
  const [isSelected, setIsSelected] = useState(false);
  const setIsWebSearch = useSetRecoilState(store.isWebSearch);

  const clickHandler = () => {
    setIsSelected((prev) => {
      const newValue = !prev;
      setIsWebSearch(newValue);
      return newValue;
    });
  };

  const iconColor = isSelected ? 'rgb(99, 102, 241)' : undefined;
  const tooltipText = isSelected
    ? localize('com_ui_enable_search')
    : localize('com_ui_disable_search');

  return (
    <TooltipAnchor
      id="com_nav_browser-button"
      aria-label={tooltipText}
      description={tooltipText}
      tabIndex={0}
      role="button"
      onClick={clickHandler}
      data-testid="search-web-button"
      className={`inline-flex size-10 items-center justify-center rounded-lg border border-border-light bg-transparent text-text-primary transition-all ease-in-out ${isSelected ? 'bg-surface-tertiary' : ''} hover:bg-surface-tertiary radix-state-open:bg-surface-tertiary`}
    >
      <Globe size={16} aria-label="Globe Icon" style={{ color: iconColor }} />
    </TooltipAnchor>
  );
}

export default SearchWeb;
