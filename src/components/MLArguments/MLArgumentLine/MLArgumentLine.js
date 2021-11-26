import { observer } from "mobx-react";
import { Block, Elem } from "../../../utils/bem";
import { Fragment } from "react";
import { Button } from "../../Common/Button/Button";
import { Icon } from "../../Common/Icon/Icon";
import { FaTrash } from "react-icons/fa";

const GroupWrapper = ({ children, wrap = false }) => {
  return wrap ? <Elem name="group">{children}</Elem> : children;
};

export const MLArgumentLine = observer(
  ({ filter, availableFilters, index, view, sidebar, dropdownClassName }) => {
    console.log(availableFilters, index, view, dropdownClassName);
    return (
      <Block name="filter-line" tag={Fragment}>
        <GroupWrapper wrap={sidebar}>
          <Elem name="column" mix="conjunction">
            {/* {index === 0 ? (
              <span style={{ fontSize: 12, paddingRight: 5 }}>Where</span>
            ) : (
              <Conjunction index={index} view={view} />
            )} */}
          </Elem>
          {/* <Elem name="column" mix="field">
            <FilterDropdown
              placeholder="Column"
              defaultValue={filter.filter.id}
              items={availableFilters}
              width={80}
              dropdownWidth={120}
              dropdownClassName={dropdownClassName}
              onChange={(value) => filter.setFilterDelayed(value)}
              optionRender={({ item: { original: filter } }) => (
                <Elem name="selector">
                  {filter.field.title}
                  {filter.field.parent && (
                    <Tag
                      size="small"
                      className="filters-data-tag"
                      color="#1d91e4"
                      style={{ marginLeft: 7 }}
                    >
                      {filter.field.parent.title}
                    </Tag>
                  )}
                </Elem>
              )}
            />
          </Elem> */}
        </GroupWrapper>
        {/* <GroupWrapper wrap={sidebar}>
          <FilterOperation
            filter={filter}
            value={filter.currentValue}
            operator={filter.operator}
            field={filter.field}
          />
        </GroupWrapper> */}
        <Elem name="remove">
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              filter.delete();
            }}
            icon={<Icon icon={FaTrash} size={12} />}
          />
        </Elem>
      </Block>
    );
  },
);
