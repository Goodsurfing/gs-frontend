import { LoginSchema } from "features/AuthByEmail";

import { OrganizationSchema } from "entities/Organization";
import { UserSchema } from "entities/User";

export interface StateSchema {
  user: UserSchema;
  organization: OrganizationSchema;
  loginForm?: LoginSchema;
}
