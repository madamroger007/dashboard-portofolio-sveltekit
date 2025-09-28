import * as schemaAuth from './schemaAuth';
import * as Certification from './schema_certification';
import * as Experience from './schema_experience';
export const schema = {
  ...schemaAuth,
  ...Certification,
  ...Experience
};
