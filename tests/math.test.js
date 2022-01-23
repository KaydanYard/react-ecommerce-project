import { Math2 } from '../src/utils/math';

test('should add two numbers', () => {
  expect(Math2.sum(1, 1)).toBe(2)
  expect(Math2.sum(1, 2)).toBe(3)
})

test('should subtract two numbers', () => {
  expect(Math2.diff(1, 1)).toBe(1 - 1)
  expect(Math2.diff(2, 1)).toBe(2 - 1)
})

// Test Driven Development
test('should compute the pythagorean theorem', () => {
  const a = 10, b = 12;
  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

  expect(Math2.pyth(a, b)).toBe(c)
})

test('should sort a list of numbers', () => {
  const numbers = [2, 6, 13, 7, 3, 10, 4, 1, -1]

  expect(Math2.sort(numbers)).toEqual([-1, 1, 2, 3, 4, 6, 7, 10, 13])
})

test('should sort a list of numbers', () => {
  const numbers = [2, 6, 7, 3, 4, 1, -1]

  expect(Math2.sort(numbers, -1)).toEqual([7, 6, 4, 3, 2, 1, -1])
})

test('should abort sort if list is not all numbers', () => {
  const numbers = ["11", 2, 6, 13, 7, 3, 10, 4, 1, -1]

  expect(Math2.sort(numbers)).toBeNull();
})