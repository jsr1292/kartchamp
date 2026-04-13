import { fail, redirect } from '@sveltejs/kit';
import { createChampionship, addDriver } from '$lib/server/db/queries';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();
    const name = data.get('name')?.toString();
    const description = data.get('description')?.toString() || '';
    const pointsSystem = data.get('pointsSystem')?.toString() || '25-18-15-12-10-8-6-4-2-1';
    const dropWorst = parseInt(data.get('dropWorst')?.toString() || '0');
    const driversJson = data.get('drivers')?.toString();

    if (!name) return fail(400, { error: 'Name is required' });
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const points = pointsSystem.split('-').map(Number);

    try {
      const champ = await createChampionship({
        name,
        slug: slug + '-' + Date.now().toString(36),
        description,
        ownerId: locals.user.id,
        pointsSystem: points,
        dropWorst,
      });

      // Add drivers
      if (driversJson) {
        const driverList = JSON.parse(driversJson);
        for (const d of driverList) {
          await addDriver({
            nickname: d.nickname,
            number: d.number || null,
            realName: d.realName || null,
            championshipId: champ.id,
          });
        }
      }

      throw redirect(303, `/championships/${champ.slug}`);
    } catch (e) {
      if (e.status === 303) throw e;
      return fail(500, { error: 'Failed to create championship' });
    }
  }
};
