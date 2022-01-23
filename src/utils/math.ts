export class Math2 {
  static sum(a: number, b: number) {
    return a + b;
  }

  static diff(a: number, b: number) {
    return a - b;
  }

  static multiply(a: number, b: number) {
    return a * b;
  }

  static divide(a: number, b: number) {
    return a / b;
  }

  static pyth(a: number, b: number) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }

  static sort(numbers: number[], direction: number = 1) {
    const valid = numbers.every((n: number) => typeof n === 'number')
    if (!valid) {
      return null;
    }
    return numbers.sort((a, b) => {
      return (a - b) * direction
    });
  }
}