import { DateTime } from 'luxon';

export class DataMixin {
  protected data: Record<string, unknown>;

  protected extractScalar(key: string, defaultValue: string | number | boolean): string | number | boolean {
    const value = this.data[key] || defaultValue;
    if (/boolean|number|string/.test(typeof value)) {
      return value as string | number | boolean;
    }
    return defaultValue;
  }

  protected extractString(key: string): string {
    return `${this.extractScalar(key, '')}`;
  }

  protected extractInteger(key: string): number {
    const value = this.extractScalar(key, 0);
    if (!Number.isNaN(Number(value))) {
      return Math.floor(Number(value));
    }
    return 0;
  }

  protected extractArray(key: string): Array<unknown> {
    const data = this.data[key] || null;
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  }

  protected extractDateTime(key: string): DateTime {
    return DateTime.fromMillis(this.extractInteger(key) * 1000);
  }
}
