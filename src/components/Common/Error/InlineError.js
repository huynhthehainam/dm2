import React from "react";
import { useSDK } from "../../../providers/SDKProvider";
import { Block } from "../../../utils/bem";
import { ErrorWrapper } from "./Error";

export const InlineError = ({
  children,
  includeValidation,
  className,
  style,
}) => {
  const context = useSDK();

  React.useEffect(() => {
    context.showModal = false;
  }, [context]);

  return context ? (
    context.error ? (
      <Block name="inline-error" mix={className} style={style}>
        <ErrorWrapper
          possum={false}
          {...context.errorFormatter(context.error, { includeValidation })}
        />
        {children}
      </Block>
    ) : null
  ) : null;
};
