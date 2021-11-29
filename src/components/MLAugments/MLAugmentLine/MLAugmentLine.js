import { observer } from "mobx-react";
import React, { Fragment } from "react";
import { FaTrash } from "react-icons/fa";
import { BemWithSpecifiContext } from "../../../utils/bem";
import { Button } from "../../Common/Button/Button";
import { Icon } from "../../Common/Icon/Icon";
import "./MLAugmentLine.styl";
import { TextArea } from "../../Common/Form";
import { MLAugmentDropdown } from "../MLAugmentDropdown";

const { Block, Elem } = BemWithSpecifiContext();

const GroupWrapper = ({ children, wrap = false }) => {
  return wrap ? <Elem name="group">{children}</Elem> : children;
};

export const MLAugmentLine = observer(
  ({
    mlAugment,
    availableOptions,
    index,
    sidebar,
    onDataChanged,
    onDataDeleted,
  }) => {
    const options = [];

    for (var option of availableOptions) {
      options.push(option.name || "");
    }

    return (
      <Block name="ml-augment-line" tag={Fragment}>
        <Elem>
          <GroupWrapper wrap={sidebar}>
            <Elem name="column" mix="conjunction">
              <span style={{ fontSize: 12, paddingRight: 5 }}>Augment</span>
            </Elem>
          </GroupWrapper>
          <GroupWrapper wrap={sidebar}>
            <Elem name="column" mix="operation">
              <MLAugmentDropdown
                placeholder="Condition"
                value={mlAugment.name}
                disabled={false}
                items={options}
                onChange={(e) => {
                  onDataChanged(index, { name: e });
                }}
              />
            </Elem>
            <Elem name="column" mix="value">
              <TextArea
                required
                value={mlAugment.paramsString}
                onBlur={(e) => {
                  const value = e.target.value;

                  try {
                    const params = JSON.parse(value);

                    onDataChanged(index, { params });
                  } catch (e) {
                    console.log(e);
                  }
                }}
                onChange={(e) => {
                  onDataChanged(index, { paramsString: e.target.value });
                }}
              />
            </Elem>
          </GroupWrapper>
          <Elem name="remove">
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                onDataDeleted(index);
              }}
              icon={<Icon icon={FaTrash} size={12} />}
            />
          </Elem>
        </Elem>
      </Block>
    );
  },
);
