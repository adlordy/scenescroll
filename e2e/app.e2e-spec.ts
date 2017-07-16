import { ScenescrollPage } from './app.po';

describe('scenescroll App', () => {
  let page: ScenescrollPage;

  beforeEach(() => {
    page = new ScenescrollPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
