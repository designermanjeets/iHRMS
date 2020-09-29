import { UniqueByPipe } from './unique-by.pipe';

describe('UniqueByPipe', () => {
  it('create an instance', () => {
    const pipe = new UniqueByPipe();
    expect(pipe).toBeTruthy();
  });
});
