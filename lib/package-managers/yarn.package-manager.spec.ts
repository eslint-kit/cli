/* eslint-disable @typescript-eslint/no-explicit-any */

import { mocked } from 'ts-jest/utils'
import { YarnRunner } from '../runners'
import { PackageManagerCommands } from './types'
import { YarnPackageManager } from './yarn.package-manager'

const MockedYarnRunner = mocked(YarnRunner, true)

jest.mock('../runners/yarn.runner', () => ({
  __esModule: true,
  YarnRunner: jest.fn(),
}))

describe('YarnPackageManager', () => {
  let packageManager: YarnPackageManager

  beforeEach(() => {
    MockedYarnRunner.mockClear()

    MockedYarnRunner.mockImplementation(() => {
      const mockedRunner = {
        run: () => Promise.resolve(),
      }

      return (mockedRunner as unknown) as YarnRunner
    })

    packageManager = new YarnPackageManager()
  })

  it('should be created', () => {
    expect(packageManager).toBeInstanceOf(YarnPackageManager)
  })

  it('should have the correct cli commands', () => {
    const expectedValues: PackageManagerCommands = {
      install: 'add',
      uninstall: 'remove',
      saveFlag: '',
      saveDevFlag: '-D',
    }

    expect(packageManager.cli).toMatchObject(expectedValues)
  })

  describe('install', () => {
    it('should use the proper command for installing', async () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run')

      await packageManager.install(['one', 'two'])
      expect(spy).toBeCalledWith('add one two --silent', true)

      await packageManager.install(['one', 'two'], 'prod')
      expect(spy).toBeCalledWith('add one two --silent', true)

      await packageManager.install(['one', 'two'], 'dev')
      expect(spy).toBeCalledWith('add -D one two --silent', true)
    })
  })

  describe('uninstall', () => {
    it('should use the proper command for uninstalling', async () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run')

      await packageManager.uninstall(['one', 'two'])
      expect(spy).toBeCalledWith('remove one two --silent', true)

      await packageManager.uninstall(['one', 'two'], 'prod')
      expect(spy).toBeCalledWith('remove one two --silent', true)

      await packageManager.uninstall(['one', 'two'], 'dev')
      expect(spy).toBeCalledWith('remove -D one two --silent', true)
    })
  })
})
