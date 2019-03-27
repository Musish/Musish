export default class Factory {
  constructor(data, lockup) {
    this.data = data;
    this.lockup = lockup;
  }

  collect() {
    return this.data;
  }

  static render() {
    return null;
  }
}
