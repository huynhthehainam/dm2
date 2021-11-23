import { inject, observer } from "mobx-react";
import React, { useCallback } from "react";
import { LSPlus } from "../../assets/icons";
import { Block, Elem } from "../../utils/bem";
import { Interface } from "../Common/Interface";
import { Space } from "../Common/Space/Space";
import { Spinner } from "../Common/Spinner";
import { Tabs, TabsItem } from "../Common/Tabs/Tabs";
import { FiltersSidebar } from "../Filters/FiltersSidebar/FilterSidebar";
import { DataView } from "../Table/Table";
import "./DataManager.styl";
import { Toolbar } from "./Toolbar/Toolbar";
import { MachineLearningSettings } from "../ML/Manager/MachineLearningSettings";

const injector = inject(({ store }) => {
  const { sidebarEnabled, sidebarVisible } = store.viewsStore ?? {};
  const currentView = store.currentView;

  return {
    shrinkWidth: sidebarEnabled && sidebarVisible,
    view: currentView,
    viewMode: currentView?.mode,
  };
});

const summaryInjector = inject(({ store }) => {
  const { project, taskStore } = store;

  return {
    totalTasks: project?.task_count ?? 0,
    totalFoundTasks: taskStore?.total ?? 0,
    totalAnnotations: taskStore?.totalAnnotations ?? 0,
    totalPredictions: taskStore?.totalPredictions ?? 0,
    cloudSync: project.target_syncing ?? project.source_syncing ?? false,
  };
});

const switchInjector = inject(({ store }) => {
  return {
    views: store.viewsStore,
    tabs: Array.from(store.viewsStore?.all ?? []),
    selectedKey: store.viewsStore?.selected?.key,
  };
});

const ProjectSummary = summaryInjector((props) => {
  return (
    <Space
      size="large"
      style={{ paddingRight: "1em", color: "rgba(0,0,0,0.3)" }}
    >
      {props.cloudSync && (
        <Space
          size="small"
          style={{ fontSize: 12, fontWeight: 400, opacity: 0.8 }}
        >
          Storage sync
          <Spinner size="small" />
        </Space>
      )}
      <span style={{ display: "flex", alignItems: "center", fontSize: 12 }}>
        <Space size="compact">
          <span>
            Tasks: {props.totalFoundTasks} / {props.totalTasks}
          </span>
          <span>Annotations: {props.totalAnnotations}</span>
          <span>Predictions: {props.totalPredictions}</span>
        </Space>
      </span>
    </Space>
  );
});

const TabsSwitch = switchInjector(
  observer(({ views, tabs, selectedKey }) => {
    return (
      <Tabs
        activeTab={selectedKey}
        onAdd={() => views.addView({ reload: false })}
        onChange={(key) => views.setSelected(key)}
        tabBarExtraContent={<ProjectSummary />}
        addIcon={<LSPlus />}
      >
        {tabs.map((tab) => (
          <TabsItem
            key={tab.key}
            tab={tab.key}
            title={tab.title}
            onFinishEditing={(title) => {
              tab.setTitle(title);
              tab.save();
            }}
            onDuplicate={() => tab.parent.duplicateView(tab)}
            onClose={() => tab.parent.deleteView(tab)}
            onSave={() => tab.virtual && tab.saveVirtual()}
            active={tab.key === selectedKey}
            editable={tab.editable}
            deletable={tab.deletable}
            virtual={tab.virtual}
          />
        ))}
      </Tabs>
    );
  }),
);

import { RadioGroup } from "../Common/RadioGroup/RadioGroup";

const DataModeToggle = injector(
  observer(({ view, size }) => {
    return (
      <RadioGroup
        value={view.mode}
        size={size}
        onChange={(e) => {
          view.setMode(e.target.value);
        }}
      >
        <RadioGroup.Button value="data">Data</RadioGroup.Button>
        <RadioGroup.Button value="ml"> Machine Learning </RadioGroup.Button>
      </RadioGroup>
    );
  }),
);

export const DataManager = injector(({ viewMode, shrinkWidth }) => {
  // console.log(Toolbar);
  // const content = viewMode === "data" ? <DataView /> : <MLManager />;
  // const renderContent = useCallback(
  //   (content) => {
  //     return content;
  //   },
  //   [viewMode],
  // );
  console.log(useCallback);
  return (
    <Block name="tabs-content">
      <Elem name="tab" mod={{ shrink: shrinkWidth }}>
        <Interface name="tabs">
          <TabsSwitch />
        </Interface>
        <DataModeToggle size="150" />
        {viewMode === "data" ? (
          <Interface name="toolbar">
            <Toolbar />
          </Interface>
        ) : null}

        {viewMode === "data" ? <DataView /> : <MachineLearningSettings />}
      </Elem>
      <FiltersSidebar />
    </Block>
  );
});
