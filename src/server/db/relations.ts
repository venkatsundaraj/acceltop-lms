import { relations } from "drizzle-orm";
import { account, session, user } from "./schema";
import { organisation } from "./organisation";
import { studentSubscription } from "./organisation-user";

export const userRelations = relations(user, ({ one }) => ({
  organisation: one(organisation, {
    fields: [user.organizationId],
    references: [organisation.id],
  }),
}));

export const organisationRelations = relations(organisation, ({ many }) => ({
  user: many(user),
  session: many(session),
  account: many(account),
}));

export const studentSubscriptionRelations = relations(
  studentSubscription,
  ({ one, many }) => ({
    student: one(user, {
      fields: [studentSubscription.studentId],
      references: [user.id],
    }),
    organization: one(organisation, {
      fields: [studentSubscription.organisationId],
      references: [organisation.id],
    }),
  })
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));
