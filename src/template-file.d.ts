declare module 'template-file'{
  function renderTemplateFile(path: string, options: any): Promise<string>;
}