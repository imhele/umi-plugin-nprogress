describe('export index', () => {
  it('should exist', async () => {
    expect(await import('./index')).toEqual({
      ...(await import('./n-progress')),
      ...(await import('./useNProgressConfig')),
    });
  });
});
