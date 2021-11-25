import React from "react";

export const SDKContext = React.createContext(null);
SDKContext.displayName = "SDK";

export const SDKProvider = ({ sdk, children }) => {
  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
};

export const useSDK = () => {
  const context = React.useContext(SDKContext);

  return context;
};
