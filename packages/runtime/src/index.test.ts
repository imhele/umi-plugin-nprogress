describe('export index', () => {
  it(' should exist', async () => {
    expect(await import('./index')).toEqual({
      ...(await import('./api')),
      ...(await import('./setup')),
    });
  });
});
