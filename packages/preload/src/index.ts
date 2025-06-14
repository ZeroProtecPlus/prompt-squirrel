import { sha256sum } from './nodeCrypto.js';
import { createSender } from './send.js';
import { versions } from './versions.js';

const configSender = createSender<IConfigController, ConfigChannel>();
const configApi: IConfigController = {
    get: (key: keyof AppConfig) => configSender.send('config:get', key),
    set: (key: keyof AppConfig, value: AppConfig[keyof AppConfig]) =>
        configSender.send('config:set', key, value),
    getAll: () => configSender.send('config:getAll'),
};

const categorySender = createSender<ICategoryController, CategoryChannel>();
const categoryApi: ICategoryController = {
    getAllCategories: () => categorySender.send('category:getAllCategories'),
    addCategory: (name: string) => categorySender.send('category:addCategory', name),
    removeCategoryByName: (name: string) =>
        categorySender.send('category:removeCategoryByName', name),
};

const tagSender = createSender<ITagController, TagChannel>();
const tagApi: ITagController = {
    getAllTags: () => tagSender.send('tag:getAllTags'),
    addTag: (name: string) => tagSender.send('tag:addTag', name),
    removeTagByName: (name: string) => tagSender.send('tag:removeTagByName', name),
};

const promptSender = createSender<IPromptController, PromptChannel>();
const promptApi: IPromptController = {
    getAllPrompts: () => promptSender.send('prompt:getAllPrompts'),
    addPrompt: (createPromptDto: CreatePromptDto) =>
        promptSender.send('prompt:addPrompt', createPromptDto),
    updatePrompt: (updatePromptDto: UpdatePromptDto) =>
        promptSender.send('prompt:updatePrompt', updatePromptDto),
    addTagToPrompt: (addTagToPromptDto: AddTagToPromptDto) =>
        promptSender.send('prompt:addTagToPrompt', addTagToPromptDto),
    removeTagFromPrompt: (removeTagFromPromptDto: RemoveTagFromPromptDto) =>
        promptSender.send('prompt:removeTagFromPrompt', removeTagFromPromptDto),
    removePromptById: (id: number) => promptSender.send('prompt:removePromptById', id),
};

const fileTransferSender = createSender<IFileTransferController, FileTransferChannel>();
const fileTransferApi: IFileTransferController = {
    exportPrompts: (options: ExportOptions) =>
        fileTransferSender.send('transfer:exportPrompts', options),
    importPrompts: () => fileTransferSender.send('transfer:importPrompts'),
};

export { sha256sum, versions, configApi, promptApi, categoryApi, tagApi, fileTransferApi };
