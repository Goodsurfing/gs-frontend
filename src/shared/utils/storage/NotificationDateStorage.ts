import Storage from './Storage';

export default class NotificationDateStorage extends Storage<'firstNotificationDate'> {
  constructor() {
    super();
  }

  public getSavedDate() {
    return this.get('firstNotificationDate')!;
  }

  public setNotificationDate() {
    if (this.getSavedDate() === null) {
      return this.set('firstNotificationDate', new Date().toDateString());
    }
  }
}