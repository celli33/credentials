import { DateTime } from 'luxon';
import { DataSpecimen } from './DataSpecimen';

const newSpecimen = new DataSpecimen({
  string: 'bar',
  int: 1,
  date: 1547388916,
  array: [{ foo: 'bar' }],
});
describe('DataMixin', () => {
  it('ExtractString', () => {
    const specimen = newSpecimen;
    expect(specimen.extractString('string')).toBe('bar');
    expect(specimen.extractString('int')).toBe('1');
    expect(specimen.extractString('date')).toBe('1547388916');
    expect(specimen.extractString('nothing')).toBe('');
    expect(specimen.extractString('array')).toBe('');
  });
  it('ExtractInteger', () => {
    const specimen = newSpecimen;
    expect(specimen.extractInteger('string')).toBe(0);
    expect(specimen.extractInteger('int')).toBe(1);
    expect(specimen.extractInteger('date')).toBe(1547388916);
    expect(specimen.extractInteger('nothing')).toBe(0);
    expect(specimen.extractInteger('array')).toBe(0);
  });
  it('ExtractDate', () => {
    const specimen = newSpecimen;
    const zero = DateTime.fromMillis(0);
    expect(specimen.extractDateTime('string')).toStrictEqual(zero);
    expect(specimen.extractDateTime('int')).toStrictEqual(zero.set({ second: 1 }));
    expect(specimen.extractDateTime('date')).toStrictEqual(DateTime.fromISO('2019-01-13T14:15:16Z'));
    expect(specimen.extractDateTime('nothing')).toStrictEqual(zero);
    expect(specimen.extractDateTime('array')).toStrictEqual(zero);
  });
  it('ExtractArray', () => {
    const specimen = newSpecimen;
    expect(specimen.extractArray('array')).toStrictEqual([{ foo: 'bar' }]);
    expect(specimen.extractArray('date')).toStrictEqual([]);
    expect(specimen.extractArray('nothing')).toStrictEqual([]);
  });
});
