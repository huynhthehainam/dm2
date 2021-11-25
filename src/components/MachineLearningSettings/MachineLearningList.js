import { format } from "date-fns";
import { useCallback } from "react";
import { FaEllipsisV } from "react-icons/fa";
import truncate from "truncate-middle";
import { Card } from "../Common/Card/Card";
import { Menu } from "../Common/Menu/Menu";
import { Dropdown } from "../Common/Dropdown/DropdownComponent";
import { Button } from "../Common/Button/Button";
import { DescriptionList } from "../Common/DescriptionList/DescriptionList";
import { confirm } from "../Common/Modal/Modal";
import { Oneof } from "../Common/Oneof/Oneof";
import { cn } from "../../utils/bem";
import { useSDK } from "../../providers/SDKProvider";
import "./MachineLearningSettings.styl";

export const MachineLearningList = ({ backends, fetchBackends, onEdit }) => {
  const rootClass = cn("ml");
  const { api } = useSDK();

  const onDeleteModel = useCallback(async (backend) => {
    
    await api.deleteBackend({ backendID: backend.id });
    await fetchBackends();
  }, []);

  const onStartTraining = useCallback(async (backend) => {
    
    await api.trainBackend({ backendID: backend.id });
    await fetchBackends();
  }, []);

  return (
    <div className={rootClass}>
      {backends.map((backend) => (
        <BackendCard
          key={backend.id}
          backend={backend}
          onStartTrain={onStartTraining}
          onDelete={onDeleteModel}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

const BackendCard = ({ backend, onStartTrain, onEdit, onDelete }) => {
  const confirmDelete = useCallback(
    (backend) => {
      confirm({
        title: "Delete ML Backend",
        body: "This action cannot be undone. Are you sure?",
        buttonLook: "destructive",
        onOk() {
          onDelete?.(backend);
        },
      });
    },
    [backend, onDelete],
  );

  return (
    <Card
      style={{ marginTop: 0 }}
      header={backend.title}
      extra={(
        <div className={cn("ml").elem("info")}>
          <BackendState backend={backend} />

          <Dropdown.Trigger
            align="right"
            content={(
              <Menu size="small">
                <Menu.Item onClick={() => onEdit(backend)}>Edit</Menu.Item>
                <Menu.Item onClick={() => confirmDelete(backend)}>
                  Delete
                </Menu.Item>
              </Menu>
            )}
          >
            <Button type="link" icon={<FaEllipsisV />} />
          </Dropdown.Trigger>
        </div>
      )}
    >
      <DescriptionList className={cn("ml").elem("summary")}>
        <DescriptionList.Item term="URL" termStyle={{ whiteSpace: "nowrap" }}>
          {truncate(backend.url, 20, 10, "...")}
        </DescriptionList.Item>
        {backend.description && (
          <DescriptionList.Item
            term="Description"
            children={backend.description}
          />
        )}
        <DescriptionList.Item term="Version">
          {backend.version
            ? format(new Date(backend.version), "MMMM dd, yyyy ∙ HH:mm:ss")
            : "unknown"}
        </DescriptionList.Item>
      </DescriptionList>

      <Button
        disabled={backend.state !== "CO"}
        onClick={() => onStartTrain(backend)}
      >
        Start Training
      </Button>
    </Card>
  );
};

const BackendState = ({ backend }) => {
  const { state } = backend;

  return (
    <div className={cn("ml").elem("status")}>
      <span className={cn("ml").elem("indicator").mod({ state })}></span>
      <Oneof value={state} className={cn("ml").elem("status-label")}>
        <span case="DI">Disconnected</span>
        <span case="CO">Connected</span>
        <span case="ER">Error</span>
        <span case="TR">Training</span>
        <span case="PR">Predicting</span>
      </Oneof>
    </div>
  );
};
