export const mockEnvs = (obj: Record<string, any>, callback: () => void) => {
  const initialValues: Record<string, any> = {};
  Object.keys(obj).forEach((k) => (initialValues[k] = process.env[k]));

  Object.assign(process.env, obj);
  callback();
  Object.assign(process.env, initialValues);
};
