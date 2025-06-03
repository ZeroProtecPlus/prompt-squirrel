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

const tagSender = createSender<ITagController, TagChannel>();
const tagApi = {
    getAllTags: () => tagSender.send('tag:getAllTags'),
    addTag: (name: string) => tagSender.send('tag:addTag', name),
    removeTagByName: (name: string) =>
        tagSender.send('tag:removeTagByName', name),
};

export { sha256sum, versions, categoryApi, tagApi };
