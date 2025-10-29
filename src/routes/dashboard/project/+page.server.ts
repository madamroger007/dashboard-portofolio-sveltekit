import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as projectService from '$lib/server/service/project/projectService';
import { type ProjectWithIcons } from '$lib/server/repositories/project/projectRepository';
export const load: PageServerLoad = async ({ url }) => {
  const result = await projectService.getAllProjectService();
  const data = result as ProjectWithIcons[];

  const flattened = data.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    description: item.description,
    publicId: item.publicId,
    categoryTitle: item.category?.title ?? '-',
    icons: item.icons?.map((i: any) => i.url) ?? [],
    createdAt: new Date(item.createdAt).toLocaleString(),
    updatedAt: new Date(item.updatedAt).toLocaleString()
  }));
  return { getData: flattened };
};

export const actions: Actions = {
  delete: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get('id') as string | null;
    if (!id) {
      return fail(400, { message: 'ID is required' });
    }
    const response = await projectService.deleteProjectService(event, id);
    if (response.status !== 200) {
      return response;
    }
    throw redirect(302, '/dashboard/project');
  }
};
