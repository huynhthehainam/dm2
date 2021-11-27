import { observer } from "mobx-react";
import React, { Fragment } from "react";
import { FaTrash } from "react-icons/fa";
import { BemWithSpecifiContext } from "../../../utils/bem";
import { Button } from "../../Common/Button/Button";
import { Icon } from "../../Common/Icon/Icon";
import { Tag } from "../../Common/Tag/Tag";
import "./MLArgumentLine.styl";
import { TextArea } from "../../Common/Form";
import { MLArgumentDropdown } from "../MLArgumentDropdown";

const { Block, Elem } = BemWithSpecifiContext();

const GroupWrapper = ({ children, wrap = false }) => {
  return wrap ? <Elem name="group">{children}</Elem> : children;
};

export const MLArgumentLine = observer(
  ({
    mlArgument,
    availableOptions,
    index,
    view,
    sidebar,
    dropdownClassName,
    onDataChanged,
  }) => {
    console.log(
      Tag,
      availableOptions,
      dropdownClassName,
      index,
      view,
      onDataChanged,
    );
    console.log("argument", mlArgument);
    return (
      <Block name="ml-argument-line" tag={Fragment}>
        <Elem>
          <GroupWrapper wrap={sidebar}>
            <Elem name="column" mix="conjunction">
              <span style={{ fontSize: 12, paddingRight: 5 }}>Argument</span>
            </Elem>
            <Elem name="column" mix="field"></Elem>
          </GroupWrapper>
          <GroupWrapper wrap={sidebar}>
            <Elem name="column" mix="operation">
              <MLArgumentDropdown
                placeholder="Condition"
                value={mlArgument.operator}
                disabled={false}
                items={availableOptions}
                onChange={(e) => {
                  onDataChanged(index, { type: e });
                }}
              />
            </Elem>
            <Elem name="column" mix="value">
              <TextArea
                onChange={(e) => {
                  console.log("input changed", e);
                }}
              />
            </Elem>
          </GroupWrapper>
          <Elem name="remove">
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                mlArgument.delete();
              }}
              icon={<Icon icon={FaTrash} size={12} />}
            />
          </Elem>
        </Elem>
      </Block>
    );
  },
);
