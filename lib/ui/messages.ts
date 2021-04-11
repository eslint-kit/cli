export const MESSAGES = {
  RUNNER_EXECUTION_ERROR: (command: string) =>
    `Failed to execute command: ${command}`,
  CONFIGS_UPDATING_STARTED: 'Updating configs..',
  CONFIGS_UPDATING_SUCCEED: 'Successfully updated configs',
  COMPLETED: 'Completed!',
  PLEASE_RESTART:
    'Please restart your IDE/editor to make sure everything works properly',
  PACKAGE_MANAGER: {
    WARNING:
      "Please don't touch package.json during the dependencies installation",
    INSTALLING: 'Installing dependencies..',
    INSTALLING_EXACT: 'Installing exact dependencies..',
    INSTALLED: 'Successfully installed dependencies',
    REMOVING: 'Removing dependencies..',
    REMOVED: 'Successfully removed dependencies',
    FAILED: (error: string) => `Command failed:\n${error}`,
    FINISHED: 'All set',
  },
}
