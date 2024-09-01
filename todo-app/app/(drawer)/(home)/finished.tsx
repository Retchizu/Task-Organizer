import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import TaskList from "../../../components/TaskList";
import { useTaskContext } from "../../../context/TaskContext";
import { taskSearchFilterFinished } from "../../../task-methods/taskSearchFilter";

const finished = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tasks } = useTaskContext();
  const [finishedTasks, setFinishedTasks] = useState<Task[]>([]);

  useEffect(() => {
    setFinishedTasks(tasks.filter((task) => task.taskStatus === "finished"));
  }, [tasks]);

  useEffect(() => {
    setFinishedTasks(taskSearchFilterFinished(searchQuery, tasks));
  }, [searchQuery, tasks]);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <TaskList tasks={finishedTasks} screenName={"finished"} />
    </View>
  );
};

export default finished;
