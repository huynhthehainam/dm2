import { inject, observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { Dropdown } from "./Dropdown/DropdownComponent";
import React from "react";
import { Button } from "./Button/Button";
import { Badge } from "./Badge/Badge";
import { MLArguments } from "../MLArguments/MLArguments";
import { FaAngleDown } from "react-icons/fa";
import { Filters } from "../Filters/Filters";

const injector = inject(({ store }) => {
  const currentView = store.currentView;

  return {
    view: currentView,
  };
});

export const MLArgumentButton = injector(
  observer(
    React.forwardRef(
      (
        { activeFiltersNumber, size, sidebarEnabled, viewsStore, ...rest },
        ref,
      ) => {
        console.log(activeFiltersNumber);
        console.log(rest);
        activeFiltersNumber = 12;
        const hasFilters = activeFiltersNumber > 0;

        return (
          <Button
            ref={ref}
            size={size}
            onClick={() => sidebarEnabled && viewsStore.toggleSidebar()}
            {...rest}
          >
            Arguments{" "}
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

export const MLArgumentPane = injector(
  observer(({ view, size, ...rest }) => {
    console.log(view);
    const dropdown = useRef();
    const sidebarEnabled = true;

    console.log(MLArguments, Filters);

    useEffect(() => {
      if (sidebarEnabled === true) {
        dropdown?.current?.close();
      }
    }, [sidebarEnabled]);

    return (
      <Dropdown.Trigger ref={dropdown} content={<MLArguments />}>
        <MLArgumentButton {...rest} size={size} />
      </Dropdown.Trigger>
    );
  }),
);
