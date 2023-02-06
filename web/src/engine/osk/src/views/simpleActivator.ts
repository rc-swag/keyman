import Activator from './activator.js';

export default class SimpleActivator extends Activator {
  private flag: boolean = true;

  get enabled(): boolean {
    return this.flag;
  }

  set enabled(value: boolean) {
    this.flag = value;
  }

  get activate(): boolean {
    return this.flag;
  }

  set activate(value: boolean) {
    if(this.flag != value) {
      this.flag = value;
      this.emit('activate', value);
    }
  }

  get conditionsMet(): boolean {
    return true;
  }
}