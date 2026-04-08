import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export function defineRulesFor(role) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (role === 'admin') {
    can('manage', 'all'); // Admin can do everything
  } else if (role === 'editor') {
    can('read', 'Post');
    can('update', 'Post');
  } else {
    can('read', 'Post'); // Standard user/guest
    cannot('delete', 'Post');
  }

  return build();
}