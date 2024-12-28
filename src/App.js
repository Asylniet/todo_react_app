import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Select,
  Input,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { Cross, MoonStars, Pencil, Sun, Trash, X } from "tabler-icons-react";

import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

const TASK_STATES = {
  Done: "Done",
  Not_Done: "Not done",
  In_progress: "Doing right now",
};

const DEADLINE_SORTS = {
  Asc: "ascending",
  Desc: "descending"
}

const TASK_UPDATE_MODE = {
  Create: "create",
  Update: "update",
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);

  const [taskUpdateMode, setTaskUpdateMode] = useState(TASK_UPDATE_MODE.Create);
  const [currentTask, setCurrentTask] = useState(undefined);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const [sortByState, setSortByState] = useState("");
  const [filterByState, setFilterByState] = useState("");

  const [sortByDeadline, setSortByDeadline] = useState("");

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const taskTitle = useRef("");
  const taskSummary = useRef("");
  const taskState = useRef("");
  const taskDeadline = useRef("");

  function createTask() {
    if(!taskTitle.current.value) {
      alert("Add task title");
      return;
    }

    const newTasks = [...tasks, {
      id: Date.now(),
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState.current.value,
      deadline: taskDeadline.current.value,
    }];

    setTasks(newTasks);
    saveTasks(newTasks);
  }

  function updateTask() {
    const oldTasks = [...tasks];
    const taskIndex = oldTasks.findIndex(task => task.id === currentTask.id);
    oldTasks[taskIndex].title = taskTitle.current.value;
    oldTasks[taskIndex].summary = taskSummary.current.value;
    oldTasks[taskIndex].state = taskState.current.value;
    oldTasks[taskIndex].deadline = taskDeadline.current.value;
    
    setTasks(oldTasks);
    saveTasks(oldTasks);
  }

  function deleteTask(id) {
    const clonedTasks = [...tasks];
    const index = tasks.findIndex(task => task.id === id);
    clonedTasks.splice(index, 1);

    setTasks(clonedTasks);
    saveTasks(clonedTasks);
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");

    const tasks = JSON.parse(loadedTasks);

    if (tasks) {
      setTasks(tasks);
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={taskUpdateMode === TASK_UPDATE_MODE.Create ? "New Task" : "Update task"}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
              setTaskUpdateMode(TASK_UPDATE_MODE.Create);
              setCurrentTask(undefined);
            }}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              ref={taskSummary}
              mt={"md"}
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            <Select 
              ref={taskState} 
              mt={"md"} 
              placeholder="Task State" 
              label="State"
              data={Object.values(TASK_STATES)}
            />
            <Input 
              mt={"md"}
              ref={taskDeadline}
              placeholder={"Task Deadline"}
              type="date"
              label="Deadline"
            />
            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setOpened(false);
                  setTaskUpdateMode(TASK_UPDATE_MODE.Create);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              {taskUpdateMode === TASK_UPDATE_MODE.Create ? (
                <Button
                  onClick={() => {
                    createTask();
                  }}
                >
                  Create Task
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    updateTask();
                  }}
                >
                  Update Task
                </Button>
              )}
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              <div>
                <Group spacing={2} position="left" align="flex-end">
                  <Select 
                    ref={taskState} 
                    mt={"md"} 
                    placeholder="Task State" 
                    label="Sort by State"
                    data={Object.values(TASK_STATES)}
                    value={sortByState}
                    onChange={setSortByState}
                  />
                  {sortByState && (
                    <ActionIcon 
                      onClick={() => {
                        setSortByState("")
                      }}
                      mb={5}
                    >
                      <X />
                    </ActionIcon>
                  )}
                </Group>
                <Group spacing={2} position="left" align="flex-end">
                  <Select 
                    mt={"md"} 
                    placeholder="Task State" 
                    label="Filter by State"
                    data={Object.values(TASK_STATES)}
                    value={filterByState}
                    onChange={setFilterByState}
                  />
                  {filterByState && (
                    <ActionIcon 
                      onClick={() => {
                        setFilterByState("")
                      }}
                      mb={5}
                    >
                      <X />
                    </ActionIcon>
                  )}
                </Group>
                <Group spacing={2} position="left" align="flex-end">
                  <Select 
                    mt={"md"} 
                    placeholder="Task Deadline" 
                    label="Sort by Deadline"
                    data={Object.values(DEADLINE_SORTS)}
                    value={sortByDeadline}
                    onChange={setSortByDeadline}
                  />
                  {sortByDeadline && (
                    <ActionIcon 
                      onClick={() => {
                        setSortByDeadline("")
                      }}
                      mb={5}
                    >
                      <X />
                    </ActionIcon>
                  )}
                </Group>
                {tasks
                  .filter(task => task.state.includes(filterByState))
                  .sort((a, b) => {
                    if(a.state === sortByState && b.state === sortByState) return 0;
                    if(a.state === sortByState) return 1;
                    if(b.state === sortByState) return -1;
                  })
                  .sort((a, b) => {
                    if(sortByDeadline === DEADLINE_SORTS.Asc) {
                      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
                    }

                    if(sortByDeadline === DEADLINE_SORTS.Desc) {
                      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
                    }

                    return -1;
                  })
                  .map((task, index) => {
                    if (task.title) {
                      return (
                        <Card withBorder key={index} mt={"sm"}>
                          <Group position={"apart"}>
                            <Text weight={"bold"}>{task.title}</Text>
                            <Group>
                              <ActionIcon
                                onClick={() => {
                                  deleteTask(index);
                                }}
                                color={"red"}
                                variant={"transparent"}
                              >
                                <Trash />
                              </ActionIcon>
                              <ActionIcon
                                onClick={() => {
                                  setCurrentTask(task);
                                  setTaskUpdateMode(TASK_UPDATE_MODE.Update);
                                  setOpened(true);

                                  setTimeout(() => {
                                    taskTitle.current.value = task.title;
                                    taskSummary.current.value = task.summary;
                                    taskState.current.value = task.state;
                                    taskDeadline.current.value = task.deadline;
                                  }, 200);
                                }}
                                variant={"transparent"}
                              >
                                <Pencil />
                              </ActionIcon>
                            </Group>
                          </Group>
                          <Text color={"dimmed"} size={"md"} mt={"sm"}>
                            {task.summary
                              ? task.summary
                              : "No summary was provided for this task"}
                          </Text>
                          <Text color={"dimmed"} size={"md"} mt={"sm"}>
                            {task.state}
                          </Text>
                          <Text color={"dimmed"} size={"md"} mt={"sm"}>
                            {task.deadline}
                          </Text>
                        </Card>
                      );
                    }
                  }
                )
              }
              </div>
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={"md"}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
