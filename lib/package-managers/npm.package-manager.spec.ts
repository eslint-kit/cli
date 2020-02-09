/* eslint-disable @typescript-eslint/no-explicit-any */

import { mocked } from 'ts-jest/utils'
import { NpmRunner } from '../runners'
import { NpmPackageManager } from './npm.package-manager'
import { PackageManagerCommands } from './types'

const MockedNpmRunner = mocked(NpmRunner, true)

jest.mock('../runners/npm.runner', () => ({
  __esModule: true,
  NpmRunner: jest.fn(),
}))

describe('NpmPackageManager', () => {
  let packageManager: NpmPackageManager

  beforeEach(() => {
    MockedNpmRunner.mockClear()

    MockedNpmRunner.mockImplementation(() => {
      const mockedRunner = {
        run: () => Promise.resolve(),
      }

      return (mockedRunner as unknown) as NpmRunner
    })

    packageManager = new NpmPackageManager()
  })

  it('should be created', () => {
    expect(packageManager).toBeInstanceOf(NpmPackageManager)
  })

  it('should have the correct cli commands', () => {
    const expectedValues: PackageManagerCommands = {
      install: 'install',
      uninstall: 'uninstall',
      saveFlag: '--save',
      saveDevFlag: '--save-dev',
    }

    expect(packageManager.cli).toMatchObject(expectedValues)
  })

  describe('install', () => {
    it('should use the proper command for installing', async () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run')

      await packageManager.install(['one', 'two'])
      expect(spy).toBeCalledWith('install one two --silent', true)

      await packageManager.install(['one', 'two'], 'prod')
      expect(spy).toBeCalledWith('install --save one two --silent', true)

      await packageManager.install(['one', 'two'], 'dev')
      expect(spy).toBeCalledWith('install --save-dev one two --silent', true)
    })
  })

  describe('uninstall', () => {
    it('should use the proper command for uninstalling', async () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run')

      await packageManager.uninstall(['one', 'two'])
      expect(spy).toBeCalledWith('uninstall one two --silent', true)

      await packageManager.uninstall(['one', 'two'], 'prod')
      expect(spy).toBeCalledWith('uninstall --save one two --silent', true)

      await packageManager.uninstall(['one', 'two'], 'dev')
      expect(spy).toBeCalledWith('uninstall --save-dev one two --silent', true)
    })
  })
})
