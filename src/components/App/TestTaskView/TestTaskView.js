import { inject } from "mobx-react";
import { Card } from "../../Common/Card/Card";

const injector = inject(({ store }) => {
  return {
    view: store?.currentView,
  };
});

export const TestTaskView = injector(() => {
  return (
    <Card header="Machine learning" style={{ maxWidth: 700, marginLeft: 50 }}>
      <div></div>
    </Card>
  );
});
