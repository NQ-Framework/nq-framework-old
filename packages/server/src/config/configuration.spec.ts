import configuration from './configuration';
describe('confiugration helper', () => {
  it('parses port as an int', () => {
    process.env.PORT = '15';
    let config = configuration();
    expect(config.port).toEqual(15);
    process.env.PORT = 'asd';
    config = configuration();
    expect(config.port).toEqual(80);

    process.env.PORT = undefined;
    config = configuration();
    expect(config.port).toEqual(80);
  });
});
