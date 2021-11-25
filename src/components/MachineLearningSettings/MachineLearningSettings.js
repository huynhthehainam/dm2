import { useSDK } from "../../providers/SDKProvider";
import { Button } from "../Common/Button/Button";
import { Divider } from "../Common/Divider/Divider";
import { ErrorWrapper } from "../Common/Error/Error";
import { InlineError } from "../Common/Error/InlineError";
import "./MachineLearningSettings.styl";
import { Form } from "../Common/Form/index";
import {
  Input,
  Label,
  Select,
  TextArea,
  Toggle
} from "../Common/Form/Elements";
import { useCallback, useEffect, useState } from "react";
import { modal } from "../Common/Modal/Modal";
import { shallowEqualObjects } from "shallow-equal";
import { MachineLearningList } from "./MachineLearningList";

const { inject } = require("mobx-react");

const injector = inject(({ store }) => {
  const currentView = store.currentView;

  return { view: currentView };
});

export const MachineLearningSettings = injector(() => {
  const { api } = useSDK();
  const sdk = useSDK();

  const [project, setProject] = useState({
    evaluate_predictions_automatically: false,
    show_collab_predictions: false,
    start_training_on_annotation_update: false,
  });
  const [versions, setVersions] = useState([]);
  const [backends, setBackends] = useState([]);
  const [mlError, setMLError] = useState();

  const resetMLVersion = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // await updateProject({
    //   model_version: null,
    // });
  }, []);

  const fetchBackends = useCallback(async () => {
    const models = await api.fetchBackends();

    console.log("models", models);
    if (models) setBackends(models);
  });

  useEffect(async () => {
    let isMounted = true;

    if (isMounted) {
      const models = await api.fetchBackends();

      console.log("models", models);
      if (models) setBackends(models);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(async () => {
    let isMounted = true;

    if (isMounted) {
      const response = await api.fetchMLVersions();

      for (const [key, value] of Object.entries(response)) {
        versions.push({
          value: key,
          label: key + " (" + value + " predictions)",
        });
      }
      console.log("versions: ", versions);

      setVersions(versions);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(async () => {
    let isMounted = true;

    if (isMounted) {
      const response = await api.fetchProject();
      const projectData = {
        evaluate_predictions_automatically:
          response.evaluate_predictions_automatically,
        show_collab_predictions: response.show_collab_predictions,
        start_training_on_annotation_update:
          response.start_training_on_annotation_update,
        id: response.id,
      };

      setProject(projectData);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const showMLFormModal = useCallback(
    (backend) => {
      console.log(mlError);
      const action = backend ? "updateMLBackend" : "addMLBackend";

      console.log({ backend });
      const modalProps = {
        title: `${backend ? "Edit" : "Add"} model`,
        style: { width: 760 },
        sdk,
        closeOnClickOutside: false,
        body: (
          <Form
            action={action}
            formData={{ ...(backend ?? { }) }}
            params={{ pk: backend?.id }}
            onSubmit={async (response) => {
              if (!response.error_message) {
                await fetchBackends();
                modalRef.close();
              }
            }}
          >
            <Input type="hidden" name="project" value={project.id} />

            <Form.Row columnCount={2}>
              <Input name="title" label="Title" placeholder="ML Model" />
              <Input name="url" label="URL" required />
            </Form.Row>

            <Form.Row columnCount={1}>
              <TextArea
                name="description"
                label="Description"
                style={{ minHeight: 120 }}
              />
            </Form.Row>

            <Form.Row columnCount={1}>
              <Toggle
                name="is_interactive"
                label="Use for interactive preannotations"
              />
            </Form.Row>

            <Form.Actions>
              <Button
                type="submit"
                look="primary"
                onClick={() => setMLError(null)}
              >
                Validate and Save
              </Button>
            </Form.Actions>

            <Form.ResponseParser>
              {(response) => (
                <>
                  {response.error_message && (
                    <ErrorWrapper
                      error={{
                        response: {
                          detail: `Failed to ${
                            backend ? "save" : "add new"
                          } ML backend.`,
                          exc_info: response.error_message,
                        },
                      }}
                    />
                  )}
                </>
              )}
            </Form.ResponseParser>

            <InlineError />
          </Form>
        ),
      };

      const modalRef = modal(modalProps);
    },
    [project],
  );

  const fetchProject = useCallback(async () => {
    const response = await api.fetchProject();

    const projectInfo = {
      evaluate_predictions_automatically:
        response.evaluate_predictions_automatically,
      show_collab_predictions: response.show_collab_predictions,
      start_training_on_annotation_update:
        response.start_training_on_annotation_update,
      id: response.id,
    };

    console.log("project", project);

    if (shallowEqualObjects(projectInfo, project) === false) {
      setProject(projectInfo);
    }
    return projectInfo;
  });

  return (
    <>
      
      <Button
        onClick={() => showMLFormModal()}
        style={{ height: "40px", fontSize: "16px", maxWidth: "110px" }}
      >
        Add Model
      </Button>
      <Divider height={32} />

      <Form
        action="updateProject"
        formData={{ ...project }}
        // params={{ pk: project.id }}
        onSubmit={() => fetchProject()}
        autosubmit
      >
        <Form.Row columnCount={1}>
          <Label text="ML-Assisted Labeling" large />

          <div style={{ paddingLeft: 16 }}>
            <Toggle
              label="Start model training after any annotations are submitted or updated"
              name="start_training_on_annotation_update"
            />
          </div>

          <div style={{ paddingLeft: 16 }}>
            <Toggle
              label="Retrieve predictions when loading a task automatically"
              name="evaluate_predictions_automatically"
            />
          </div>

          <div style={{ paddingLeft: 16 }}>
            <Toggle
              label="Show predictions to annotators in the Label Stream and Quick View"
              name="show_collab_predictions"
            />
          </div>
        </Form.Row>

        {versions.length > 1 && (
          <Form.Row columnCount={1}>
            <Label
              text="Model Version"
              description="Model version allows you to specify which prediction will be shown to the annotators."
              style={{ marginTop: 16 }}
              large
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: 400,
                paddingLeft: 16,
              }}
            >
              <div style={{ flex: 1, paddingRight: 16 }}>
                <Select
                  name="model_version"
                  defaultValue={null}
                  options={[...versions]}
                  placeholder="No model version selected"
                />
              </div>

              <Button onClick={resetMLVersion}>Reset</Button>
            </div>
          </Form.Row>
        )}
      </Form>
      <MachineLearningList
        onEdit={(backend) => showMLFormModal(backend)}
        fetchBackends={fetchBackends}
        backends={backends}
      />
    </>
  );
});
