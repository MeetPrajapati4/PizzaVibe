let runtime = {
  mode: "mysql",
  warning: null
};

export function setDatabaseRuntime(nextRuntime) {
  runtime = {
    ...runtime,
    ...nextRuntime
  };
}

export function getDatabaseRuntime() {
  return runtime;
}
