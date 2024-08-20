import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import TaskList from "../../../components/TaskList";
import { useTaskContext } from "../../../context/TaskContext";

const finished = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tasks } = useTaskContext();
  const [finishedTasks, setFinishedTasks] = useState(
    tasks.filter((task) => task.taskStatus === "finished")
  );

  useEffect(() => {
    setFinishedTasks(tasks.filter((task) => task.taskStatus === "finished"));
  }, [tasks]);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <TaskList tasks={finishedTasks} />
    </View>
  );
};

export default finished;

const styles = StyleSheet.create({});
