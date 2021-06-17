import { DateTime } from 'luxon';
import { DataMixin } from '../../../src/internal/DataMixin';

export class DataSpecimen extends DataMixin {
  constructor(data: Record<string, unknown>) {
    super();
    this.data = data;
  }

  public extractScalar(key: string, defaultValue: string | number | boolean): string | number | boolean {
    return super.extractScalar(key, defaultValue);
  }

  public extractString(key: string): string {
    return super.extractString(key);
  }

  public extractInteger(key: string): number {
    return super.extractInteger(key);
  }

  public extractArray(key: string): Array<unknown> {
    return super.extractArray(key);
  }

  public extractDateTime(key: string): DateTime {
    return super.extractDateTime(key);
  }
}
