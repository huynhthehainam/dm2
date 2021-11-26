import { inject } from "mobx-react";
import { Block, Elem } from "../../utils/bem";
import { MLArgumentLine } from "./MLArgumentLine/MLArgumentLine";
import { Button } from "../Common/Button/Button";
import { FaPlus } from "react-icons/fa";
import { FilterLine } from "../Filters/FilterLine/FilterLine";
import React from "react";

import "./MLArguments.styl";
import { cn } from "../../utils/bem";
// import {  useState } from "react";

const injector = inject(({ store }) => ({
  store,
  views: store.viewsStore,
  currentView: store.currentView,
  filters: store.currentView?.currentFilters ?? [],
  mlArguments: store.currentView?.currentMLArguments ?? [],
}));

export const MLArguments = injector(({ views, currentView, mlArguments }) => {
  console.log(MLArgumentLine);
  const { sidebarEnabled } = views;

  const fields = React.useMemo(
    () =>
      currentView.availableFilters.reduce((res, filter) => {
        const target = filter.field.target;
        const groupTitle = target
          .split("_")
          .map((s) =>
            s
              .split("")
              .map((c, i) => (i === 0 ? c.toUpperCase() : c))
              .join(""),
          )
          .join(" ");

        const group = res[target] ?? {
          id: target,
          title: groupTitle,
          options: [],
        };

        group.options.push({
          value: filter.id,
          title: filter.field.title,
          original: filter,
        });

        return { ...res, [target]: group };
      }, {}),
    [currentView.availableFilters],
  );

  console.log(fields, FilterLine, cn);
  console.log("arg2", mlArguments);

  return (
    <Block name="arguments" mod={{ sidebar: sidebarEnabled }}>
      <Elem name="list" mod={{ withFilters: !!mlArguments.length }}>
        {mlArguments.length ? (
          mlArguments.map((filter, i) => (
            // <FilterLine
            //   index={i}
            //   filter={filter}
            //   view={currentView}
            //   sidebar={sidebarEnabled}
            //   value={filter.currentValue}
            //   key={`${filter.filter.id}-${i}`}
            //   availableFilters={Object.values(fields)}
            //   dropdownClassName={cn("filters").elem("selector")}
            // />
            <h1 key={`${filter} ${i}`}>hsfasf</h1>
          ))
        ) : (
          <Elem name="empty">No filters applied</Elem>
        )}
      </Elem>
      <Elem name="actions">
        <Button
          type="primary"
          size="small"
          onClick={() => currentView.createMLArgument()}
          icon={<FaPlus />}
        >
          Add {mlArguments.length ? "Another Filter" : "Filter"}
        </Button>
      </Elem>
    </Block>
  );
});
