import { inject } from "mobx-react";
import { Block, Elem } from "../../utils/bem";
import { MLArgumentLine } from "./MLArgumentLine/MLArgumentLine";
import { Button } from "../Common/Button/Button";
import { FaPlus } from "react-icons/fa";
import { FilterLine } from "../Filters/FilterLine/FilterLine";
import React, { useCallback, useState } from "react";

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

export const MLArguments = injector(({ views, currentView }) => {
  console.log(MLArgumentLine, views, Block, Button, FaPlus, useCallback);

  var [mlArguments, setMLArguments] = useState([
    {
      id: 1,
      currentValue: "hello",
      operator: "add",
      field: "word",
    },
    {
      id: 1,
      currentValue: "hello",
      operator: "add",
      field: "word",
    },
  ]);
  const availableOperators = ["add", "data"];

  const createMLArgument = useCallback(() => {
    const newMLArguments = [...mlArguments];

    newMLArguments.push({
      id: 1,
      currentValue: "hello",
      operator: "add",
      field: "word",
    });
    setMLArguments(newMLArguments);
  }, [mlArguments]);

  const updateMLArguments = useCallback((index, data) => {
    console.log("index", index);
    console.log("data", data);
  });

  console.log(FilterLine, cn);
  console.log("arg2", mlArguments);

  return (
    <Block name="arguments" mod={{ sidebar: false }}>
      <Elem name="list" mod={{ withFilters: false }}>
        {mlArguments.length ? (
          mlArguments.map((mlArgument, i) => (
            <MLArgumentLine
              index={i}
              mlArgument={mlArgument}
              view={currentView}
              sidebar={false}
              value={mlArgument.currentValue}
              key={`-${i}`}
              availableOptions={availableOperators}
              dropdownClassName={cn("filters").elem("selector")}
              onDataChanged={updateMLArguments}
            />
          ))
        ) : (
          <Elem name="empty">No filters applied</Elem>
        )}
      </Elem>
      <Elem name="actions">
        <Button
          type="primary"
          size="small"
          onClick={() => createMLArgument()}
          icon={<FaPlus />}
        >
          Add {mlArguments.length ? "Another Argument" : "Argument"}
        </Button>
      </Elem>
    </Block>
  );
});
