import { equals, greater, lower } from './dependency-version-compare'

describe('dependency version compare', () => {
  test('lower', () => {
    expect(lower('1.1.1', '2.2.2')).toBeTruthy()
    expect(lower('2.1.1', '2.2.2')).toBeTruthy()
    expect(lower('2.2.1', '2.2.2')).toBeTruthy()
    expect(lower('2.2.2', '2.2.2')).toBeFalsy()
    expect(lower('2.2.3', '2.2.2')).toBeFalsy()
    expect(lower('2.3.3', '2.2.2')).toBeFalsy()
    expect(lower('3.3.3', '2.2.2')).toBeFalsy()

    expect(lower('^1.1.1', '2.2.2')).toBeTruthy()
    expect(lower('^2.2.2', '2.2.2')).toBeFalsy()
    expect(lower('^3.3.3', '2.2.2')).toBeFalsy()
  })

  test('greater', () => {
    expect(greater('1.1.1', '2.2.2')).toBeFalsy()
    expect(greater('2.1.1', '2.2.2')).toBeFalsy()
    expect(greater('2.2.1', '2.2.2')).toBeFalsy()
    expect(greater('2.2.2', '2.2.2')).toBeFalsy()
    expect(greater('2.2.3', '2.2.2')).toBeTruthy()
    expect(greater('2.3.3', '2.2.2')).toBeTruthy()
    expect(greater('3.3.3', '2.2.2')).toBeTruthy()

    expect(greater('^1.1.1', '2.2.2')).toBeFalsy()
    expect(greater('^2.2.2', '2.2.2')).toBeTruthy()
    expect(greater('^3.3.3', '2.2.2')).toBeTruthy()
  })

  test('equals', () => {
    expect(equals('1.1.1', '2.2.2')).toBeFalsy()
    expect(equals('2.1.1', '2.2.2')).toBeFalsy()
    expect(equals('2.2.1', '2.2.2')).toBeFalsy()
    expect(equals('2.2.2', '2.2.2')).toBeTruthy()
    expect(equals('2.2.3', '2.2.2')).toBeFalsy()
    expect(equals('2.3.3', '2.2.2')).toBeFalsy()
    expect(equals('3.3.3', '2.2.2')).toBeFalsy()

    expect(equals('^1.1.1', '2.2.2')).toBeFalsy()
    expect(equals('^2.2.2', '2.2.2')).toBeFalsy()
    expect(equals('^3.3.3', '2.2.2')).toBeFalsy()
  })
})
