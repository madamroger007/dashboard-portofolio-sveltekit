import * as schemaAuth from './schemaAuth';
import * as Certification from './schema_certification';
import * as Experience from './schema_experience';
import * as icons from './schema_icons';
import * as projects from './schema_project';
import * as skills from './schema_skill';
export const schema = {
  ...schemaAuth,
  ...Certification,
  ...Experience,
  ...icons,
  ...projects,
  ...skills
};
