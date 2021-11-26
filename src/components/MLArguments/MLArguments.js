import { inject } from "mobx-react";
import { Block, Elem } from "../../utils/bem";
import { MLArgumentLine } from "./MLArgumentLine/MLArgumentLine";
import { Button } from "../Common/Button/Button";
import { FaPlus } from "react-icons/fa";

import "./MLArguments.styl";
import { cn } from "../../utils/bem";
// import {  useState } from "react";

const injector = inject(({ store }) => {
  console.log("mlArs", store.currentView?.mlArguments);
  return {
    store,
    views: store.viewsStore,
    currentView: store.currentView,
    filters: store.currentView?.currentFilters ?? [],
    mlArguments: store.currentView?.mlArguments ?? [],
  };
});

export const MLArguments = injector(({ mlArguments, views, currentView }) => {
  console.log(views, currentView);

  // const [mlArguments, setMLArguments] = useState([{}, {}]);

  // console.log(setMLArguments);

  // const createArgument = useCallback(() => {
  //   mlArguments.push({});
  //   setMLArguments(mlArguments);
  // }, [mlArguments]);

  return (
    <Block name="arguments">
      <Elem name="list" mod={{ withArguments: !!mlArguments.length }}>
        {mlArguments.length ? (
          mlArguments.map((mlArgument, i) => (
            <MLArgumentLine
              index={i}
              filter={mlArgument}
              view={currentView}
              // sidebar={sidebarEnabled}
              value={mlArgument.currentValue}
              key=""
              // availableFilters={Object.values(fields)}
              dropdownClassName={cn("filters").elem("selector")}
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
          onClick={() => currentView.createMLArgument()}
          icon={<FaPlus />}
        >
          Add {mlArguments.length ? "Another arguments" : "Arguments"}
        </Button>
      </Elem>
    </Block>
  );
});
