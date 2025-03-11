import { Globe } from 'lucide-react';
import { useChatContext, useAddedChatContext } from '~/Providers';
import { TooltipAnchor } from '~/components';
import { useLocalize } from '~/hooks';
import { useState } from "react";

function SearchWeb() {
  const { conversation } = useChatContext();
  const { setConversation: setAddedConvo } = useAddedChatContext();
  const localize = useLocalize();
  const [isSelected, setIsSelected ] = useState(false);

  const clickHandler = () => {
    setIsSelected(!isSelected);
    if(!isSelected) {return;}
  };

  if (!conversation) {
    return null;
  }

  return (
    <TooltipAnchor
      id="com_nav_browser-button"
      aria-label={localize('com_nav_browser')}
      description={localize('com_nav_browser')}
      tabIndex={0}
      role="button"
      onClick={clickHandler}
      data-testid="parameters-button"
      className="inline-flex size-10 items-center justify-center rounded-lg border border-border-light bg-transparent text-text-primary transition-all ease-in-out hover:bg-surface-tertiary disabled:pointer-events-none disabled:opacity-50 radix-state-open:bg-surface-tertiary"
    >
      <Globe size={16} aria-label="Globe Icon" style={{
        color: isSelected ? '#3dfeff' : 'currentColor',
      }} />
    </TooltipAnchor>
  );
}

export default SearchWeb;
