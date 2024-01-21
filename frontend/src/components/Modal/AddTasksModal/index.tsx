import React from "react";
import ModalBody from "../ModalBody";
import ModalContainer from "../ModalContainer";
import ModalTitle from "../ModalTitle";
import ModalInput from "../ModalInput";
import ModalSelectPriority from "../ModalSelectPriority";
import ModalTextArea from "../ModalTextArea";
import SquareButton from "../../Button/SquareButton";
import axiosInstance from "../../../utils/axiosInstance";

type AddTasksModalProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTasks: React.Dispatch<React.SetStateAction<any>>;
};

export default function AddTasksModal({
  setOpenModal,
  setTasks,
}: AddTasksModalProps) {
  const [taskName, setTaskName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [priority, setPriority] = React.useState<string>("high");
  const [dueDate, setDueDate] = React.useState<string>("");

  const handleCreateTask = (e: React.FormEvent): void => {
    e.preventDefault();
    axiosInstance
      .post("/api/tasks/create-task/", {
        name: taskName,
        description: description,
        priority: priority,
        due: dueDate,
      })
      .then((res) => {
        setTasks((prev: any) => [...prev, res.data]);
        setOpenModal(false);
      });
  };

  return (
    <ModalBody>
      <ModalContainer onSubmit={handleCreateTask}>
        <ModalTitle text="Add Task" />
        <ModalInput
          label="Task Name"
          type="text"
          id="create-task-name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          isRequired={true}
        />

        <ModalTextArea
          label="Description"
          id="create-task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <ModalInput
          label="Due Date"
          type="date"
          id="create-task-due"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          isRequired={true}
        />

        <ModalSelectPriority
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />

        <div className="mt-3 flex w-full justify-end ">
          <SquareButton
            className="mx-1"
            variant="tertiary"
            size="fit"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </SquareButton>
          <SquareButton
            className="mx-1"
            variant="secondary"
            size="fit"
            type="submit"
          >
            Create
          </SquareButton>
        </div>
      </ModalContainer>
    </ModalBody>
  );
}
