import { sha256sum } from './nodeCrypto.js';
import { createSender } from './send.js';
import { versions } from './versions.js';

const categorySender = createSender<ICategoryController, CategoryChannel>();

const categoryApi = {
    getAllCategories: () => categorySender.send('category:getAllCategories'),
    addCategory: (name: string) => categorySender.send('category:addCategory', name),
    removeCategoryByName: (name: string) =>
        categorySender.send('category:removeCategoryByName', name),
};

export { sha256sum, versions, categoryApi };
