import { DrideWebsitePage } from './app.po';

describe('dride-website App', () => {
  let page: DrideWebsitePage;

  beforeEach(() => {
    page = new DrideWebsitePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
