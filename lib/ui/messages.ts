export const MESSAGES = {
  RUNNER_EXECUTION_ERROR: (command: string) =>
    `Failed to execute command: ${command}`,
  CONFIGS_UPDATING_STARTED: 'Updating configs..',
  CONFIGS_UPDATING_SUCCEED: 'Successfully updated configs',
  COMPLETED: 'Completed!',
  PLEASE_RESTART:
    'Please restart your IDE/editor to make sure everything works properly',
  PACKAGE_MANAGER_INSTALLATION_WARNING:
    "Please don't touch package.json during the dependencies installation",
  PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: 'Installing dependencies..',
  PACKAGE_MANAGER_INSTALLATION_SUCCEED: 'Successfully installed dependencies',
  PACKAGE_MANAGER_INSTALLATION_FAILED: 'Packages installation failed',
  PACKAGE_MANAGER_UNINSTALLATION_WARNING:
    "Please don't touch package.json during the dependencies uninstallation",
  PACKAGE_MANAGER_UNINSTALLATION_IN_PROGRESS: 'Uninstalling dependencies..',
  PACKAGE_MANAGER_UNINSTALLATION_SUCCEED:
    'Successfully uninstalled dependencies',
  PACKAGE_MANAGER_UNINSTALLATION_FAILED: 'Packages uninstallation failed',
}
