import { inject, observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { Dropdown } from "./Dropdown/DropdownComponent";
import React from "react";
import { Button } from "./Button/Button";
import { Badge } from "./Badge/Badge";
import { MLAugments } from "../MLAugments/MLAugments";
import { FaAngleDown } from "react-icons/fa";

const injector = inject(({ store }) => {
  const currentView = store.currentView;

  return {
    view: currentView,
  };
});

export const MLAugmentButton = injector(
  observer(
    React.forwardRef(
      (
        { activeFiltersNumber, size, sidebarEnabled, viewsStore, ...rest },
        ref,
      ) => {
        activeFiltersNumber = 12;
        const hasFilters = activeFiltersNumber > 0;

        return (
          <Button
            ref={ref}
            size={size}
            onClick={() => sidebarEnabled && viewsStore.toggleSidebar()}
            {...rest}
          >
            Augments{" "}
            {hasFilters && (
              <Badge size="small" style={{ marginLeft: 5 }}>
                {activeFiltersNumber}
              </Badge>
            )}
            <FaAngleDown size="16" style={{ marginLeft: 4 }} color="#0077FF" />
          </Button>
        );
      },
    ),
  ),
);

export const MLAugmentPane = injector(
  observer(({ size, augments, ...rest }) => {
    const dropdown = useRef();
    const sidebarEnabled = true;

    useEffect(() => {
      if (sidebarEnabled === true) {
        dropdown?.current?.close();
      }
    }, [sidebarEnabled]);

    return (
      <Dropdown.Trigger
        ref={dropdown}
        content={<MLAugments augments={augments} />}
      >
        <MLAugmentButton {...rest} size={size} />
      </Dropdown.Trigger>
    );
  }),
);
