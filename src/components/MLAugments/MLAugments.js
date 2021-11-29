import { inject } from "mobx-react";
import { Block, Elem } from "../../utils/bem";
import { MLAugmentLine } from "./MLAugmentLine/MLAugmentLine";
import { Button } from "../Common/Button/Button";
import { FaPlus } from "react-icons/fa";
import React, { useCallback, useEffect, useState } from "react";

import "./MLAugments.styl";
import { cn } from "../../utils/bem";
import { useSDK } from "../../providers/SDKProvider";
// import {  useState } from "react";

const injector = inject(({ store }) => ({
  store,
  views: store.viewsStore,
  currentView: store.currentView,
}));

export const MLAugments = injector(({ currentView, augments }) => {
  const { api } = useSDK();

  const availableOptions = [
    {
      name: "Resize",
      params: {
        image_size: 224,
      },
      paramsString: '{"image_size": 224}',
    },
    {
      name: "Center crop",
      params: {
        image_size: 224,
      },
      paramsString: '{"image_size": 224}',
    },
  ];

  const [mlAugments, setMLAugments] = useState([]);

  useEffect(() => {
    setMLAugments(augments);
  }, [augments]);

  const createMLAugment = useCallback(() => {
    const newMLAugments = [...mlAugments];

    newMLAugments.push(JSON.parse(JSON.stringify(availableOptions[0])));
    setMLAugments(newMLAugments);
    api.updateProject(null, { body: { ml_augments: newMLAugments } });
  }, [mlAugments]);

  const updateMLAugments = useCallback((index, data) => {
    const newMLAugments = [...mlAugments];

    if (index < newMLAugments.length) {
      var augment = newMLAugments[index];

      Object.assign(augment, data);
      setMLAugments(newMLAugments);

      if (data.paramsString) {
        return;
      }
      console.log("new ml", newMLAugments);
      api.updateProject(null, { body: { ml_augments: newMLAugments } });
    }
  });
  const deleteMLAugment = useCallback((index) => {
    const newMLAugments = [...mlAugments];

    if (index < newMLAugments.length) {
      newMLAugments.splice(index, 1);
      setMLAugments(newMLAugments);
      api.updateProject(null, { body: { ml_augments: newMLAugments } });
    }
  });

  return (
    <Block name="augments" mod={{ sidebar: false }}>
      <Elem name="list" mod={{ withFilters: false }}>
        {mlAugments.length ? (
          mlAugments.map((mlAugment, i) => (
            <MLAugmentLine
              index={i}
              mlAugment={mlAugment}
              view={currentView}
              sidebar={false}
              key={`-${i}`}
              availableOptions={availableOptions}
              dropdownClassName={cn("filters").elem("selector")}
              onDataDeleted={deleteMLAugment}
              onDataChanged={updateMLAugments}
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
          onClick={() => createMLAugment()}
          icon={<FaPlus />}
        >
          Add {mlAugments.length ? "Another Augment" : "Augment"}
        </Button>
      </Elem>
    </Block>
  );
});
